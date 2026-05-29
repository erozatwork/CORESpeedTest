/**
 * Public IP Detection Utility
 * Fetches user's public IP address using the local API first
 */

const LOCAL_IP_ENDPOINT = "/api/speedtest/ip";

/**
 * Get public IP address
 * Uses multiple fallback APIs for reliability
 * @returns {Promise<string>} - Public IP address
 */
export async function getPublicIP() {
  try {
    const response = await fetch(LOCAL_IP_ENDPOINT, {
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.ip && isValidIP(data.ip)) {
        return data.ip;
      }
    }
  } catch (error) {
    console.warn(`Failed to fetch IP from ${LOCAL_IP_ENDPOINT}:`, error);
  }

  const apis = [
    {
      url: "https://api.ipify.org?format=json",
      extractIP: (data) => data.ip,
    },
    {
      url: "https://ipinfo.io/json",
      extractIP: (data) => data.ip,
    },
    {
      url: "https://ip-api.com/json/",
      extractIP: (data) => data.query,
    },
  ];

  for (const api of apis) {
    try {
      const response = await fetch(api.url, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) continue;

      const data = await response.json();
      const ip = api.extractIP(data);

      if (ip && isValidIP(ip)) {
        return ip;
      }
    } catch (error) {
      console.warn(`Failed to fetch IP from ${api.url}:`, error);
      continue;
    }
  }

  return "Unknown";
}

/**
 * Validate IP address format
 * @param {string} ip - IP address to validate
 * @returns {boolean} - True if valid IP format
 */
function isValidIP(ip) {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-f]{0,4}:){2,7}[0-9a-f]{0,4}$/i;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * Get geolocation info from IP
 * @returns {Promise<Object>} - { ip, city, country, isp }
 */
export async function getIPGeolocation() {
  try {
    const response = await fetch("https://ipinfo.io/json");
    if (!response.ok) throw new Error("Failed to fetch geolocation");

    const data = await response.json();
    return {
      ip: data.ip || "Unknown",
      city: data.city || "Unknown",
      country: data.country || "Unknown",
      isp: data.org || "Unknown",
    };
  } catch (error) {
    console.error("Geolocation error:", error);
    return {
      ip: "Unknown",
      city: "Unknown",
      country: "Unknown",
      isp: "Unknown",
    };
  }
}
