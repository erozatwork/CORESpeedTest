using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using CAS.FinancePortal.Web.Server.Core.Applications;
using CAS.FinancePortal.Web.Server.Core.Models.Dtos.SpeedTest;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace CAS.FinancePortal.Web.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class SpeedTestController(ISpeedTestService speedTestService, IWebHostEnvironment environment) : ControllerBase
    {
        private static readonly HttpClient _httpClient = new()
        {
            Timeout = TimeSpan.FromSeconds(4)
        };

        private readonly ISpeedTestService _speedTestService = speedTestService;
        private readonly IWebHostEnvironment _environment = environment;

        private bool IsLocalDevelopmentRequest()
        {
            if (!_environment.IsDevelopment())
                return false;

            var host = Request.Host.Host;

            return string.Equals(host, "localhost", StringComparison.OrdinalIgnoreCase)
                || string.Equals(host, "127.0.0.1", StringComparison.OrdinalIgnoreCase)
                || string.Equals(host, "::1", StringComparison.OrdinalIgnoreCase);
        }

        /// <summary>
        /// Get current user's employee ID from claims
        /// </summary>
        private int GetEmployeeId()
        {
            var employeeIdClaim = User.FindFirst("employee_id")?.Value
                ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? (IsLocalDevelopmentRequest() ? "9" : throw new UnauthorizedAccessException("Employee ID not found in token"));

            if (!int.TryParse(employeeIdClaim, out var employeeId))
            {
                if (IsLocalDevelopmentRequest())
                    return 9;

                throw new UnauthorizedAccessException("Invalid employee ID in token");
            }

            return employeeId;
        }

        private string ResolveClientIpAddress()
        {
            var forwardedFor = Request.Headers["X-Forwarded-For"].FirstOrDefault();
            if (!string.IsNullOrWhiteSpace(forwardedFor))
            {
                var firstForwarded = forwardedFor.Split(',').FirstOrDefault()?.Trim();
                if (!string.IsNullOrWhiteSpace(firstForwarded))
                    return firstForwarded;
            }

            var xRealIp = Request.Headers["X-Real-IP"].FirstOrDefault();
            if (!string.IsNullOrWhiteSpace(xRealIp))
                return xRealIp;

            var cloudflareIp = Request.Headers["CF-Connecting-IP"].FirstOrDefault();
            if (!string.IsNullOrWhiteSpace(cloudflareIp))
                return cloudflareIp;

            var remoteIp = HttpContext.Connection.RemoteIpAddress;
            if (remoteIp is null)
                return string.Empty;

            if (remoteIp.IsIPv4MappedToIPv6)
                remoteIp = remoteIp.MapToIPv4();

            if (IPAddress.IsLoopback(remoteIp))
                return "127.0.0.1";

            return remoteIp.ToString();
        }

        private static bool IsValidPublicIp(string? ip)
        {
            if (string.IsNullOrWhiteSpace(ip))
                return false;

            if (!IPAddress.TryParse(ip, out var parsedIp))
                return false;

            if (IPAddress.IsLoopback(parsedIp))
                return false;

            if (parsedIp.Equals(IPAddress.Any) || parsedIp.Equals(IPAddress.IPv6Any))
                return false;

            if (IsPrivateOrReservedAddress(parsedIp))
                return false;

            return true;
        }

        private static bool IsPrivateOrReservedAddress(IPAddress ipAddress)
        {
            if (ipAddress.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
            {
                var bytes = ipAddress.GetAddressBytes();

                // RFC1918 private IPv4 ranges
                if (bytes[0] == 10)
                    return true;

                if (bytes[0] == 172 && bytes[1] >= 16 && bytes[1] <= 31)
                    return true;

                if (bytes[0] == 192 && bytes[1] == 168)
                    return true;

                // Link-local / carrier-grade NAT / documentation / multicast / reserved
                if (bytes[0] == 169 && bytes[1] == 254)
                    return true;

                if (bytes[0] == 100 && bytes[1] >= 64 && bytes[1] <= 127)
                    return true;

                if (bytes[0] >= 224)
                    return true;

                return false;
            }

            // IPv6 unique local, link-local, multicast, unspecified
            if (ipAddress.AddressFamily == System.Net.Sockets.AddressFamily.InterNetworkV6)
            {
                if (ipAddress.IsIPv6LinkLocal || ipAddress.IsIPv6Multicast || ipAddress.Equals(IPAddress.IPv6Any))
                    return true;

                var bytes = ipAddress.GetAddressBytes();
                return (bytes[0] & 0xfe) == 0xfc; // fc00::/7 unique local
            }

            return true;
        }

        private async Task<string?> ResolvePublicIpAsync()
        {
            var externalApis = new[]
            {
                "https://api.ipify.org?format=json",
                "https://api64.ipify.org?format=json",
                "https://ipinfo.io/json",
            };

            foreach (var apiUrl in externalApis)
            {
                try
                {
                    using var response = await _httpClient.GetAsync(apiUrl);
                    if (!response.IsSuccessStatusCode)
                        continue;

                    var payload = await response.Content.ReadAsStringAsync();
                    var ip = ExtractIpFromResponse(apiUrl, payload);

                    if (IsValidPublicIp(ip))
                        return ip;
                }
                catch
                {
                    continue;
                }
            }

            var fallbackIp = ResolveClientIpAddress();
            return IsValidPublicIp(fallbackIp) ? fallbackIp : null;
        }

        private static string? ExtractIpFromResponse(string apiUrl, string payload)
        {
            try
            {
                using var document = JsonDocument.Parse(payload);
                var root = document.RootElement;

                if (apiUrl.Contains("ipinfo.io", StringComparison.OrdinalIgnoreCase))
                {
                    return root.TryGetProperty("ip", out var ipProperty) ? ipProperty.GetString() : null;
                }

                if (root.TryGetProperty("ip", out var directIpProperty))
                {
                    return directIpProperty.GetString();
                }
            }
            catch
            {
                // Ignore JSON parse errors and fall through to plain-text parsing.
            }

            return payload.Trim();
        }

        [AllowAnonymous]
        [HttpGet("ip")]
        public async Task<IActionResult> GetPublicIp()
        {
            var publicIp = await ResolvePublicIpAsync();

            return Ok(new
            {
                success = true,
                ip = string.IsNullOrWhiteSpace(publicIp) ? "Unknown" : publicIp
            });
        }

        [HttpGet("probe/ping")]
        public IActionResult ProbePing()
        {
            return Ok(new
            {
                success = true,
                serverTimeUtc = DateTimeOffset.UtcNow
            });
        }

        [HttpGet("probe/download")]
        public IActionResult ProbeDownload([FromQuery] int sizeBytes = 10 * 1024 * 1024)
        {
            var clampedSize = Math.Clamp(sizeBytes, 64 * 1024, 20 * 1024 * 1024);
            var payload = new byte[clampedSize];
            RandomNumberGenerator.Fill(payload);

            Response.Headers.CacheControl = "no-store, no-cache, must-revalidate";
            return File(payload, "application/octet-stream");
        }

        [HttpPost("probe/upload")]
        public async Task<IActionResult> ProbeUpload()
        {
            long totalBytes = 0;
            var buffer = new byte[64 * 1024];

            while (true)
            {
                var bytesRead = await Request.Body.ReadAsync(buffer, 0, buffer.Length);
                if (bytesRead <= 0)
                    break;

                totalBytes += bytesRead;
            }

            Response.Headers.CacheControl = "no-store, no-cache, must-revalidate";
            return Ok(new
            {
                success = true,
                receivedBytes = totalBytes
            });
        }

        /// <summary>
        /// Create a new speed test result
        /// POST: api/speedtest/create
        /// </summary>
        [HttpPost("create")]
        public async Task<IActionResult> CreateSpeedTest([FromBody] SpeedTestResultRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var resolvedPublicIp = request.PublicIp;
                if (string.IsNullOrWhiteSpace(resolvedPublicIp)
                    || string.Equals(resolvedPublicIp, "Unknown", StringComparison.OrdinalIgnoreCase)
                    || string.Equals(resolvedPublicIp, "0.0.0.0", StringComparison.OrdinalIgnoreCase))
                {
                    resolvedPublicIp = ResolveClientIpAddress();
                }

                request = request with { PublicIp = resolvedPublicIp };

                var employeeId = GetEmployeeId();
                    var (isSuccess, status, message, data) = await _speedTestService.CreateSpeedTestAsync(employeeId, request);

                    if (!isSuccess)
                        return StatusCode(status, new { success = false, message });

                    return StatusCode(status, new { success = true, message, data });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get speed test history for current user
        /// GET: api/speedtest/history?days=30
        /// </summary>
        [HttpGet("history")]
        public async Task<IActionResult> GetSpeedTestHistory([FromQuery] int days = 30)
        {
            try
            {
                var employeeId = GetEmployeeId();
                    var (isSuccess, status, message, data) = await _speedTestService.GetSpeedTestHistoryAsync(employeeId, days);

                    if (!isSuccess)
                        return StatusCode(status, new { success = false, message });

                    return Ok(new { success = true, message, data });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get speed test statistics for current user
        /// GET: api/speedtest/stats?days=30
        /// </summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetSpeedTestStats([FromQuery] int days = 30)
        {
            try
            {
                var employeeId = GetEmployeeId();
                    var (isSuccess, status, message, data) = await _speedTestService.GetSpeedTestStatsAsync(employeeId, days);

                    if (!isSuccess)
                        return StatusCode(status, new { success = false, message });

                    return Ok(new { success = true, message, data });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Get latest speed test result for current user
        /// GET: api/speedtest/latest
        /// </summary>
        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestSpeedTest()
        {
            try
            {
                var employeeId = GetEmployeeId();
                    var (isSuccess, status, message, data) = await _speedTestService.GetLatestSpeedTestAsync(employeeId);

                    if (!isSuccess)
                        return StatusCode(status, new { success = false, message });

                    return Ok(new { success = true, message, data });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Delete a speed test result
        /// DELETE: api/speedtest/delete/{id}
        /// </summary>
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteSpeedTest(Guid id)
        {
            try
            {
                    var (isSuccess, status, message) = await _speedTestService.DeleteSpeedTestAsync(id);

                    if (!isSuccess)
                        return StatusCode(status, new { success = false, message });

                    return Ok(new { success = true, message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { success = false, message = ex.Message });
            }
        }
    }
}
