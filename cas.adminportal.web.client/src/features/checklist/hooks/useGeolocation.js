import { useState, useCallback } from "react";

export function useGeolocation() {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    isLoading: false,
  });

  const getLocation = useCallback(async () => {
    setLocation((prev) => ({ ...prev, isLoading: true, error: null }));

    if (!navigator.geolocation) {
      const error = "Geolocation is not supported by your browser";
      setLocation((prev) => ({ ...prev, error, isLoading: false }));
      return { error };
    }

    const tryGetPosition = (options) =>
      new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
      );

    try {
      let position;

      try {
        // First attempt: high-accuracy GPS (best on mobile outdoors)
        position = await tryGetPosition({
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        });
      } catch {
        // Fallback: network/wifi-based (faster, works indoors on desktop)
        position = await tryGetPosition({
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 30000,
        });
      }

      const { latitude, longitude, accuracy } = position.coords;

      // Warn in console if accuracy is poor (desktop IP-based is often 1000m+)
      if (accuracy > 200) {
        console.warn(`Low GPS accuracy: ±${Math.round(accuracy)}m. Results may be approximate.`);
      }

      const locationData = { latitude, longitude, accuracy };
      setLocation((prev) => ({ ...prev, ...locationData, isLoading: false, error: null }));
      return locationData;

    } catch (err) {
      let errorMessage = "Unable to get location";
      if (err.code === 1) errorMessage = "Location permission denied. Please enable it in browser settings.";
      else if (err.code === 2) errorMessage = "Location information is unavailable.";
      else if (err.code === 3) errorMessage = "Location request timed out.";

      setLocation((prev) => ({ ...prev, error: errorMessage, isLoading: false }));
      return { error: errorMessage };
    }
  }, []);

  return { ...location, getLocation };
}