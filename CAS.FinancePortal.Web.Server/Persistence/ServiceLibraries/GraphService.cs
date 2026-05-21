using Azure.Identity;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace CAS.FinancePortal.Web.Server.Persistence.ServiceLibraries
{
	public class GraphService : IGraphService
	{
		private readonly GraphServiceClient _graphClient;
		private readonly HttpClient _httpClient;
		private readonly string _tenantId;
		private readonly string _clientId;
		private readonly string _clientSecret;
		private bool _disposed;

		public GraphService(string tenantId, string clientId, string clientSecret)
		{
			_tenantId = tenantId ?? throw new ArgumentNullException(nameof(tenantId));
			_clientId = clientId ?? throw new ArgumentNullException(nameof(clientId));
			_clientSecret = clientSecret ?? throw new ArgumentNullException(nameof(clientSecret));

			var clientSecretCredential = new ClientSecretCredential(tenantId, clientId, clientSecret);
			_graphClient = new GraphServiceClient(clientSecretCredential);
			_httpClient = new HttpClient();
		}

		public async Task<List<string>> GetDistributionGroupEmails(string distroEmail)
		{
			if (string.IsNullOrWhiteSpace(distroEmail))
				throw new ArgumentException("Distribution email cannot be null or empty.", nameof(distroEmail));

			var emails = new List<string>();

			try
			{
				var group = await GetGroupByEmailAsync(distroEmail);
				if (group == null) return emails;

				var members = await _graphClient.Groups[group.Id].Members.GetAsync();
				if (members?.Value == null) return emails;

				emails.AddRange(members.Value
					.Select(GetEmailFromDirectoryObject)
					.Where(email => !string.IsNullOrEmpty(email)));
			}
			catch (Microsoft.Graph.ServiceException ex)
			{
				Console.WriteLine($"Graph API error: {ex.Message}");
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Unexpected error: {ex.Message}");
			}

			return emails;
		}

       public async Task<string?> GetUserIdByEmailAsync(string email)
		{
			if (string.IsNullOrWhiteSpace(email))
				throw new ArgumentException("Email cannot be null or empty.", nameof(email));

			try
			{
				var users = await _graphClient.Users
					.GetAsync(config =>
					{
						config.QueryParameters.Filter = $"mail eq '{email}'";
						config.QueryParameters.Select = new[] { "id", "displayName", "mail" };
						config.QueryParameters.Top = 1;
					});

				return users?.Value?.FirstOrDefault()?.Id;
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error retrieving user: {ex.Message}");
				return null;
			}
		}

		public async Task SendEmailAsync(string fromUserEmail, string recipientEmail, string subject, string body)
		{
			ValidateEmailParameters(fromUserEmail, recipientEmail, subject);

			try
			{
				var message = new Message
				{
					Subject = subject,
					Body = new ItemBody
					{
						ContentType = BodyType.Html,
						Content = body
					},
					ToRecipients = new List<Recipient>
					{
						new Recipient
						{
							EmailAddress = new EmailAddress { Address = recipientEmail }
						}
					}
				};

				await _graphClient.Users[fromUserEmail].SendMail
					.PostAsync(new Microsoft.Graph.Users.Item.SendMail.SendMailPostRequestBody
					{
						Message = message,
						SaveToSentItems = true
					});

				Console.WriteLine("Email sent successfully.");
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error sending email: {ex.Message}");
				throw;
			}
		}

		public async Task<List<Message>> GetEmailsByDistroEmailAsync(string distroEmail, string emailAddress, int maxEmails = 20)
		{
			if (string.IsNullOrWhiteSpace(distroEmail))
				throw new ArgumentException("Distribution email cannot be null or empty.", nameof(distroEmail));
			if (string.IsNullOrWhiteSpace(emailAddress))
				throw new ArgumentException("Email address cannot be null or empty.", nameof(emailAddress));

			try
			{
				var memberEmails = await GetDistributionGroupEmails(distroEmail);
				if (!memberEmails.Any())
				{
					Console.WriteLine($"No members found for distribution group: {distroEmail}");
					return new List<Message>();
				}

				var emailTasks = memberEmails.Select(memberEmail =>
					GetEmailsForUserAsync(memberEmail, emailAddress, maxEmails));

				var results = await Task.WhenAll(emailTasks);

				return results
					.SelectMany(r => r)
					.OrderByDescending(m => m.ReceivedDateTime)
					.ToList();
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error retrieving emails: {ex.Message}");
				return new List<Message>();
			}
		}

		public async Task<string> CreateCalendarEventAsync(
			string fromUserEmail,
			string subject,
			string body,
			DateTime startTimeUtc,
			DateTime endTimeUtc,
			string timeZone,
			List<string> attendeesEmails)
		{
			ValidateEventParameters(fromUserEmail, subject, startTimeUtc, endTimeUtc, timeZone, attendeesEmails);

			try
			{
				var tzInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZone);
				var localStartTime = TimeZoneInfo.ConvertTimeFromUtc(startTimeUtc, tzInfo);
				var localEndTime = TimeZoneInfo.ConvertTimeFromUtc(endTimeUtc, tzInfo);

				var newEvent = new Event
				{
					Subject = subject,
					Body = new ItemBody
					{
						ContentType = BodyType.Html,
						Content = body
					},
					IsOnlineMeeting = true,
					Start = new DateTimeTimeZone
					{
						DateTime = localStartTime.ToString("yyyy-MM-ddTHH:mm:ss"),
						TimeZone = timeZone
					},
					End = new DateTimeTimeZone
					{
						DateTime = localEndTime.ToString("yyyy-MM-ddTHH:mm:ss"),
						TimeZone = timeZone
					},
					Location = new Microsoft.Graph.Models.Location { DisplayName = "Online Meeting" },
					Attendees = attendeesEmails.Select(email => new Attendee
					{
						EmailAddress = new EmailAddress { Address = email },
						Type = AttendeeType.Required
					}).ToList()
				};

				var created = await _graphClient.Users[fromUserEmail].Calendar.Events.PostAsync(newEvent);

              if (string.IsNullOrWhiteSpace(created?.Id))
				{
					throw new InvalidOperationException("Event creation failed.");
				}

				var fresh = await _graphClient.Users[fromUserEmail].Events[created.Id]
					.GetAsync(req =>
					{
						req.QueryParameters.Select = new[] { "id", "isOnlineMeeting", "onlineMeeting", "onlineMeetingUrl" };
					});

                return fresh?.OnlineMeeting?.JoinUrl ?? fresh?.OnlineMeetingUrl ?? string.Empty;
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error creating calendar event: {ex.Message}");
				throw;
			}
		}

		public async Task<List<Event>> GetCalendarEventsByDistroEmailAsync(string distroEmail, string attendeeEmail)
		{
			if (string.IsNullOrWhiteSpace(distroEmail))
				throw new ArgumentException("Distribution email cannot be null or empty.", nameof(distroEmail));
			if (string.IsNullOrWhiteSpace(attendeeEmail))
				throw new ArgumentException("Attendee email cannot be null or empty.", nameof(attendeeEmail));

			try
			{
				var memberEmails = await GetDistributionGroupEmails(distroEmail);
				if (!memberEmails.Any())
				{
					Console.WriteLine($"No members found for distribution group: {distroEmail}");
					return new List<Event>();
				}

				var eventTasks = memberEmails.Select(memberEmail =>
					GetEventsForUserAsync(memberEmail, attendeeEmail));

				var results = await Task.WhenAll(eventTasks);

				return results
					.SelectMany(r => r)
					.OrderBy(e => e.Start?.DateTime)
					.ToList();
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error retrieving calendar events: {ex.Message}");
				return new List<Event>();
			}
		}


		public async Task<string> GetGroupIdByMailNicknameAsync(string mailNickname)
		{
			var accessToken = await GetGraphAccessTokenAsync();

			if (string.IsNullOrWhiteSpace(accessToken))
				throw new ArgumentException("Access token cannot be null or empty.", nameof(accessToken));
			if (string.IsNullOrWhiteSpace(mailNickname))
				throw new ArgumentException("Mail nickname cannot be null or empty.", nameof(mailNickname));

			using var request = new HttpRequestMessage(HttpMethod.Get,
				$"https://graph.microsoft.com/v1.0/groups?$filter=mailNickname eq '{mailNickname}'&$select=id,displayName,mail,mailNickname");
			request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

			var resp = await _httpClient.SendAsync(request);
			resp.EnsureSuccessStatusCode();

			var json = await resp.Content.ReadAsStringAsync();
			using var doc = JsonDocument.Parse(json);

			var values = doc.RootElement.GetProperty("value");
			if (values.GetArrayLength() == 0)
				throw new InvalidOperationException($"No group found with mailNickname='{mailNickname}'.");

			return values[0].GetProperty("id").GetString()!;
		}

		public async Task<string> GetGroupDriveIdAsync(string groupId)
		{
			var accessToken = await GetGraphAccessTokenAsync();
			if (string.IsNullOrWhiteSpace(accessToken))
				throw new ArgumentException("Access token cannot be null or empty.", nameof(accessToken));
			if (string.IsNullOrWhiteSpace(groupId))
				throw new ArgumentException("Group ID cannot be null or empty.", nameof(groupId));

			using var request = new HttpRequestMessage(HttpMethod.Get,
				$"https://graph.microsoft.com/v1.0/groups/{groupId}/drive");
			request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

			var resp = await _httpClient.SendAsync(request);
			resp.EnsureSuccessStatusCode();

			var json = await resp.Content.ReadAsStringAsync();
			using var doc = JsonDocument.Parse(json);

			return doc.RootElement.GetProperty("id").GetString()!;
		}

		public async Task<string> UploadDocxToDriveAsync(string driveId,string driveFolder,string fileBaseName,byte[] docxBytes)
		{

			var accessToken = await GetGraphAccessTokenAsync();
			ValidateUploadParameters(accessToken, driveId, driveFolder, fileBaseName, docxBytes);

			var fileName = $"{fileBaseName}.docx";
			var uploadUrl = $"https://graph.microsoft.com/v1.0/drives/{driveId}/root:/{Uri.EscapeDataString(driveFolder)}/{Uri.EscapeDataString(fileName)}:/content";

			using var request = new HttpRequestMessage(HttpMethod.Put, uploadUrl);
			request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
			request.Content = new ByteArrayContent(docxBytes);
			request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.wordprocessingml.document");

			var resp = await _httpClient.SendAsync(request);
			resp.EnsureSuccessStatusCode();

			var json = await resp.Content.ReadAsStringAsync();
			using var doc = JsonDocument.Parse(json);

			return doc.RootElement.GetProperty("id").GetString()!;
		}

		public async Task<byte[]?> DownloadPdfFromDriveItemAsync(string driveId, string itemId)
		{
			var accessToken = await GetGraphAccessTokenAsync();

			if (string.IsNullOrWhiteSpace(accessToken))
				throw new ArgumentException("Access token cannot be null or empty.", nameof(accessToken));
			if (string.IsNullOrWhiteSpace(driveId))
				throw new ArgumentException("Drive ID cannot be null or empty.", nameof(driveId));
			if (string.IsNullOrWhiteSpace(itemId))
				throw new ArgumentException("Item ID cannot be null or empty.", nameof(itemId));

			var convertUrl = $"https://graph.microsoft.com/v1.0/drives/{driveId}/items/{itemId}/content?format=pdf";

			using var request = new HttpRequestMessage(HttpMethod.Get, convertUrl);
			request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

			var resp = await _httpClient.SendAsync(request);
			resp.EnsureSuccessStatusCode();

			return await resp.Content.ReadAsByteArrayAsync();
		}

		public async Task DeleteDriveItemAsync( string driveId, string itemId)
		{
			var accessToken = await GetGraphAccessTokenAsync();

			if (string.IsNullOrWhiteSpace(accessToken))
				throw new ArgumentException("Access token cannot be null or empty.", nameof(accessToken));
			if (string.IsNullOrWhiteSpace(driveId))
				throw new ArgumentException("Drive ID cannot be null or empty.", nameof(driveId));
			if (string.IsNullOrWhiteSpace(itemId))
				throw new ArgumentException("Item ID cannot be null or empty.", nameof(itemId));

			var deleteUrl = $"https://graph.microsoft.com/v1.0/drives/{driveId}/items/{itemId}";

			using var request = new HttpRequestMessage(HttpMethod.Delete, deleteUrl);
			request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

			await _httpClient.SendAsync(request);
		}

		// Private helper methods
		private async Task<string> GetGraphAccessTokenAsync()
		{
			var tokenUrl = $"https://login.microsoftonline.com/{_tenantId}/oauth2/v2.0/token";

			using var form = new FormUrlEncodedContent(new[]
			{
				new KeyValuePair<string,string>("client_id", _clientId),
				new KeyValuePair<string,string>("client_secret", _clientSecret),
				new KeyValuePair<string,string>("grant_type", "client_credentials"),
				new KeyValuePair<string,string>("scope", "https://graph.microsoft.com/.default"),
			});

			var resp = await _httpClient.PostAsync(tokenUrl, form);
			resp.EnsureSuccessStatusCode();

			var json = await resp.Content.ReadAsStringAsync();
			using var doc = JsonDocument.Parse(json);
			return doc.RootElement.GetProperty("access_token").GetString()!;
		}
      private async Task<Group?> GetGroupByEmailAsync(string distroEmail)
		{
			var groups = await _graphClient.Groups
				.GetAsync(config =>
				{
					config.QueryParameters.Filter = $"mail eq '{distroEmail}'";
					config.QueryParameters.Top = 1;
				});

			var group = groups?.Value?.FirstOrDefault();
			if (group == null)
			{
				Console.WriteLine($"Group not found for email: {distroEmail}");
			}
			return group;
		}

      private string? GetEmailFromDirectoryObject(DirectoryObject member)
		{
			return member switch
			{
				User user => user.Mail,
				OrgContact contact => contact.Mail,
				_ => null
			};
		}

		private async Task<List<Message>> GetEmailsForUserAsync(string userEmail, string targetEmail, int maxEmails)
		{
			try
			{
				var inboxTask = GetMessagesFromFolderAsync(userEmail, "inbox", targetEmail, maxEmails);
				var sentTask = GetMessagesFromFolderAsync(userEmail, "sentitems", targetEmail, maxEmails);

				await Task.WhenAll(inboxTask, sentTask);

				var allMessages = new List<Message>();
				allMessages.AddRange(await inboxTask);
				allMessages.AddRange(await sentTask);

				return allMessages
					.OrderByDescending(m => m.ReceivedDateTime)
					.ToList();
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error retrieving emails for user {userEmail}: {ex.Message}");
				return new List<Message>();
			}
		}

		private async Task<List<Message>> GetMessagesFromFolderAsync(string userEmail, string folder, string targetEmail, int maxEmails)
		{
			try
			{
				var messagesResponse = await _graphClient.Users[userEmail]
					.MailFolders[folder].Messages
					.GetAsync(config =>
					{
						config.QueryParameters.Select = new[]
						{
							"id", "subject", "from", "toRecipients", "ccRecipients", "receivedDateTime", "bodyPreview"
						};
						config.QueryParameters.Top = maxEmails;
					});

				if (messagesResponse?.Value == null) return new List<Message>();

				return messagesResponse.Value
					.Where(msg => IsRelevantMessage(msg, userEmail, targetEmail))
					.OrderByDescending(m => m.ReceivedDateTime)
					.ToList();
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error retrieving {folder} for user {userEmail}: {ex.Message}");
				return new List<Message>();
			}
		}

		private bool IsRelevantMessage(Message msg, string userEmail, string targetEmail)
		{
			var fromAddress = msg.From?.EmailAddress?.Address;
            var toAddresses = msg.ToRecipients?
                .Select(r => r.EmailAddress?.Address)
                .Where(addr => addr != null)
                .Cast<string>()
                .ToList() ?? new List<string>();

			return (fromAddress == userEmail && toAddresses.Contains(targetEmail)) ||
				   (fromAddress == targetEmail && toAddresses.Contains(userEmail));
		}

		private async Task<List<Event>> GetEventsForUserAsync(string userEmail, string attendeeEmail)
		{
			try
			{
				var events = await _graphClient.Users[userEmail].Calendar.Events
					.GetAsync(config =>
					{
						config.QueryParameters.Select = new[]
						{
							"id", "subject", "body", "start", "end", "location", "organizer", "attendees", "onlineMeeting", "createddatetime"
						};
						config.QueryParameters.Orderby = new[] { "start/dateTime asc" };
					});

				if (events?.Value == null) return new List<Event>();

				return events.Value
					.Where(e => e.Attendees?.Any(a => a.EmailAddress?.Address == attendeeEmail) == true)
					.ToList();
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error retrieving calendar events for user {userEmail}: {ex.Message}");
				return new List<Event>();
			}
		}

		private void ValidateEmailParameters(string fromUserEmail, string recipientEmail, string subject)
		{
			if (string.IsNullOrWhiteSpace(fromUserEmail))
				throw new ArgumentException("From email cannot be null or empty.", nameof(fromUserEmail));
			if (string.IsNullOrWhiteSpace(recipientEmail))
				throw new ArgumentException("Recipient email cannot be null or empty.", nameof(recipientEmail));
			if (string.IsNullOrWhiteSpace(subject))
				throw new ArgumentException("Subject cannot be null or empty.", nameof(subject));
		}

		private void ValidateEventParameters(
			string fromUserEmail,
			string subject,
			DateTime startTimeUtc,
			DateTime endTimeUtc,
			string timeZone,
			List<string> attendeesEmails)
		{
			if (string.IsNullOrWhiteSpace(fromUserEmail))
				throw new ArgumentException("From email cannot be null or empty.", nameof(fromUserEmail));
			if (string.IsNullOrWhiteSpace(subject))
				throw new ArgumentException("Subject cannot be null or empty.", nameof(subject));
			if (endTimeUtc <= startTimeUtc)
				throw new ArgumentException("End time must be after start time.");
			if (string.IsNullOrWhiteSpace(timeZone))
				throw new ArgumentException("Time zone cannot be null or empty.", nameof(timeZone));
			if (attendeesEmails == null || !attendeesEmails.Any())
				throw new ArgumentException("At least one attendee email is required.", nameof(attendeesEmails));
		}

		private void ValidateUploadParameters(string accessToken, string driveId, string driveFolder, string fileBaseName, byte[] docxBytes)
		{
			if (string.IsNullOrWhiteSpace(accessToken))
				throw new ArgumentException("Access token cannot be null or empty.", nameof(accessToken));
			if (string.IsNullOrWhiteSpace(driveId))
				throw new ArgumentException("Drive ID cannot be null or empty.", nameof(driveId));
			if (string.IsNullOrWhiteSpace(driveFolder))
				throw new ArgumentException("Drive folder cannot be null or empty.", nameof(driveFolder));
			if (string.IsNullOrWhiteSpace(fileBaseName))
				throw new ArgumentException("File base name cannot be null or empty.", nameof(fileBaseName));
			if (docxBytes == null || docxBytes.Length == 0)
				throw new ArgumentException("Document bytes cannot be null or empty.", nameof(docxBytes));
		}

		public void Dispose()
		{
			Dispose(true);
			GC.SuppressFinalize(this);
		}

		protected virtual void Dispose(bool disposing)
		{
			if (!_disposed)
			{
				if (disposing)
				{
					_graphClient?.Dispose();
					_httpClient?.Dispose();
				}
				_disposed = true;
			}
		}
	}

	public interface IGraphService
	{

		Task<List<string>> GetDistributionGroupEmails(string distroEmail);
       Task<string?> GetUserIdByEmailAsync(string email);
		Task SendEmailAsync(string fromUserEmail, string recipientEmail, string subject, string body);
		Task<List<Message>> GetEmailsByDistroEmailAsync(string distroEmail, string emailAddress, int maxEmails = 20);
		Task<string> CreateCalendarEventAsync(
			string fromUserEmail,
			string subject,
			string body,
			DateTime startTimeUtc,
			DateTime endTimeUtc,
			string timeZone,
			List<string> attendeesEmails);
		Task<List<Event>> GetCalendarEventsByDistroEmailAsync(string distroEmail, string attendeeEmail);
		Task<string> GetGroupIdByMailNicknameAsync(string mailNickname);
		Task<string> GetGroupDriveIdAsync(string groupId);
		Task<string> UploadDocxToDriveAsync(string driveId, string driveFolder, string fileBaseName, byte[] docxBytes);
		Task<byte[]?> DownloadPdfFromDriveItemAsync(string driveId, string itemId);
		Task DeleteDriveItemAsync(string driveId, string itemId);
	}
}