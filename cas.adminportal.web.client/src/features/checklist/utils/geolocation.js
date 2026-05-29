export async function reverseGeocode(latitude, longitude) {
  if (latitude == null || longitude == null) {
    return "Location unavailable";
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1`,
      {
        headers: {
          "User-Agent": "CAS-FinancePortal/1.0",
          "Accept-Language": "en",
        },
      }
    );

    if (!response.ok) throw new Error(`Nominatim error: ${response.status}`);

    const data = await response.json();
    if (data.error) throw new Error(data.error);

    const address = buildAddress(data.address);

    // Fall back to Nominatim's own pre-formatted string if our parser yields nothing
    return address || data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
}

function buildAddress(addr) {
  if (!addr) return null;

  // Street — roads in PH malls/walkways may not be tagged as "road"
  const street =
    addr.road ||
    addr.pedestrian ||
    addr.footway ||
    addr.path ||
    null;

  // District/barangay — Nominatim returns PH barangays as suburb or quarter
  const district =
    addr.quarter ||
    addr.neighbourhood ||
    addr.suburb ||
    addr.city_district ||
    addr.village ||
    addr.hamlet ||
    null;

  // City/municipality
  const city =
    addr.city ||
    addr.town ||
    addr.municipality ||
    addr.county ||
    null;

  // Province/region — PH provinces come through as state or province
  const region =
    addr.state ||
    addr.province ||
    addr.region ||
    null;

  const parts = [street, district, city, region, addr.country].filter(Boolean);

  // Deduplicate while preserving order
  const seen = new Set();
  const unique = parts.filter((p) => {
    if (seen.has(p)) return false;
    seen.add(p);
    return true;
  });

  return unique.length ? unique.join(", ") : null;
}

export async function getLocationDetails(latitude, longitude) {
  const address = await reverseGeocode(latitude, longitude);
  return {
    latitude,
    longitude,
    address,
    timestamp: new Date().toISOString(),
  };
}