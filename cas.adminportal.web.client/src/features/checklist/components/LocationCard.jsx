import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@shared/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@shared/components/ui/tabs";
import { RenderCoreIcon } from "@shared/core_icons/CoreIcons";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getLocationDetails } from "../utils/geolocation";

function isValidCoordinate(latitude, longitude) {
  return (
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
  );
}

const defaultIcon = new L.Icon({
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    dblclick(event) {
      onLocationSelect?.(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function MapView({
  latitude,
  longitude,
  centerLatitude,
  centerLongitude,
  zoomLevel,
  activeTab,
  onLocationSelect,
  onZoomChange,
  recenterVersion = 0,
  heightClass = "h-80",
  showHints = true,
  showZoomControls = true,
}) {
  const hasCoordinates =
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude);

  const hasCenterCoordinates =
    typeof centerLatitude === "number" &&
    typeof centerLongitude === "number" &&
    !Number.isNaN(centerLatitude) &&
    !Number.isNaN(centerLongitude);

  const mapCenter = useMemo(() => {
    if (hasCenterCoordinates) {
      return [centerLatitude, centerLongitude];
    }

    if (hasCoordinates) {
      return [latitude, longitude];
    }

    return null;
  }, [hasCenterCoordinates, centerLatitude, centerLongitude, hasCoordinates, latitude, longitude]);

  const MapCenterUpdater = () => {
    const map = useMap();

    useEffect(() => {
      map.setView(mapCenter, map.getZoom(), { animate: true });
    }, [map, mapCenter, recenterVersion]);

    useEffect(() => {
      map.zoomControl?.remove?.();
    }, [map]);

    useEffect(() => {
      map.setZoom(zoomLevel, { animate: true });
    }, [map, zoomLevel]);

    return null;
  };

  const tileUrl =
    activeTab === "satellite"
      ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const attribution =
    activeTab === "satellite"
      ? 'Tiles &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community'
      : '&copy; OpenStreetMap contributors';

  return (
    <div className={`relative w-full ${heightClass} rounded-lg overflow-hidden border bg-gray-100`}>
      {mapCenter ? (
        <MapContainer center={mapCenter} zoom={zoomLevel} className="h-full w-full" scrollWheelZoom zoomControl={false} doubleClickZoom={false}>
          <TileLayer url={tileUrl} attribution={attribution} />
          <MapClickHandler onLocationSelect={onLocationSelect} />
          <MapCenterUpdater />

          {hasCoordinates && (
            <Marker position={[latitude, longitude]}>
              <Popup>
                Selected location
              </Popup>
            </Marker>
          )}
        </MapContainer>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-center px-6">
          <div>
            <RenderCoreIcon name="MapPin" size={32} className="mx-auto mb-3 text-red-500" />
            <p className="text-sm font-medium text-gray-700">Detecting your current location...</p>
            <p className="text-xs text-gray-500 mt-1">The map will appear once location access is available.</p>
          </div>
        </div>
      )}

      {showZoomControls && (
        <div className="absolute right-4 top-4 flex flex-col gap-2 z-[1000]">
          <button
            type="button"
            onClick={() => onZoomChange?.("in")}
            className="bg-white rounded-md p-2 shadow hover:shadow-md transition-shadow"
            aria-label="Zoom in"
          >
            <RenderCoreIcon name="Plus" size={20} />
          </button>
          <button
            type="button"
            onClick={() => onZoomChange?.("out")}
            className="bg-white rounded-md p-2 shadow hover:shadow-md transition-shadow"
            aria-label="Zoom out"
          >
            <RenderCoreIcon name="Minus" size={20} />
          </button>
        </div>
      )}

      {showHints && (
        <div className="absolute left-4 bottom-4 z-[1000] rounded-md bg-white/90 px-3 py-2 text-xs text-gray-700 shadow">
          Double click anywhere to select your current location.
        </div>
      )}
    </div>
  );
}

export default function LocationCard({
  className = "",
  address = "Balagtas, 3016 Bulacan, Philippines",
  latitude = 14.7833,
  longitude = 120.8167,
  centerLatitude,
  centerLongitude,
  recenterVersion = 0,
  coordinates = "RWG2+V3H, Balagtas",
  onLocationSelect = null,
  onAddressConfirmed = null,
  onPreciseLocation = null,
  preciseLoading = false,
}) {
  const [activeTab, setActiveTab] = useState("map");
  const [zoomLevel, setZoomLevel] = useState(18);
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmationState, setConfirmationState] = useState("pending");
  const [displayAddress, setDisplayAddress] = useState(address || "");
  const [selectedLatitude, setSelectedLatitude] = useState(
    isValidCoordinate(latitude, longitude) ? latitude : null
  );
  const [selectedLongitude, setSelectedLongitude] = useState(
    isValidCoordinate(latitude, longitude) ? longitude : null
  );
  const [recenterToken, setRecenterToken] = useState(0);
  const userConfirmedRef = useRef(false);

  const hasCoordinates =
    isValidCoordinate(selectedLatitude, selectedLongitude) ||
    isValidCoordinate(latitude, longitude);

  const currentLatitude = isValidCoordinate(selectedLatitude, selectedLongitude) ? selectedLatitude : latitude;
  const currentLongitude = isValidCoordinate(selectedLatitude, selectedLongitude) ? selectedLongitude : longitude;

  useEffect(() => {
    const hasIncomingCoordinates = isValidCoordinate(latitude, longitude);

    if (!hasIncomingCoordinates) {
      return;
    }

    setSelectedLatitude(latitude);
    setSelectedLongitude(longitude);
    setDisplayAddress(address || "");
    setConfirmationState(userConfirmedRef.current ? "confirmed" : "pending");
    setRecenterToken((prev) => prev + 1);
    userConfirmedRef.current = false;
  }, [latitude, longitude, address]);

  useEffect(() => {
    if (!isValidCoordinate(latitude, longitude)) {
      return;
    }

    if (!address) {
      return;
    }

    setDisplayAddress(address);
  }, [address, latitude, longitude]);

  const handleOpenInMaps = () => {
    const mapsUrl = hasCoordinates
      ? `https://www.google.com/maps/search/?api=1&query=${currentLatitude},${currentLongitude}`
      : "https://www.google.com/maps";
    window.open(mapsUrl, "_blank");
  };

  const handleZoom = (direction) => {
    setZoomLevel((prev) => {
      const next = direction === "in" ? prev + 1 : prev - 1;
      return Math.min(21, Math.max(3, next));
    });
  };

  const handleMapSelect = (selectedLatitude, selectedLongitude) => {
    const resolvedLatitude = Number(selectedLatitude);
    const resolvedLongitude = Number(selectedLongitude);

    setSelectedLatitude(resolvedLatitude);
    setSelectedLongitude(resolvedLongitude);
    setRecenterToken((prev) => prev + 1);

    void (async () => {
      try {
        const locationDetails = await getLocationDetails(resolvedLatitude, resolvedLongitude);
        const resolvedAddress =
          locationDetails?.address || `${resolvedLatitude.toFixed(4)}, ${resolvedLongitude.toFixed(4)}`;

        setDisplayAddress(resolvedAddress);
        setConfirmationState("confirmed");
        userConfirmedRef.current = true;
        setIsExpanded(false);

        onLocationSelect?.(resolvedLatitude, resolvedLongitude);
        onAddressConfirmed?.(resolvedAddress, resolvedLatitude, resolvedLongitude);
      } catch (error) {
        const fallbackAddress = `${resolvedLatitude.toFixed(4)}, ${resolvedLongitude.toFixed(4)}`;

        console.warn("Reverse geocoding failed for selected location:", error);
        setDisplayAddress(fallbackAddress);
        setConfirmationState("confirmed");
        userConfirmedRef.current = true;
        setIsExpanded(false);

        onLocationSelect?.(resolvedLatitude, resolvedLongitude);
        onAddressConfirmed?.(fallbackAddress, resolvedLatitude, resolvedLongitude);
      }
    })();
  };

  const handleConfirmLocation = () => {
    if (!isValidCoordinate(currentLatitude, currentLongitude)) {
      return;
    }

    setConfirmationState("confirmed");
    userConfirmedRef.current = true;
    onAddressConfirmed?.(
      displayAddress || address || `${currentLatitude.toFixed(4)}, ${currentLongitude.toFixed(4)}`,
      currentLatitude,
      currentLongitude
    );
  };

  const handleChangeLocation = () => {
    setConfirmationState("pending");
    userConfirmedRef.current = false;
  };

  const handleFixLocation = () => {
    setConfirmationState("pending");
    setIsExpanded(true);
    userConfirmedRef.current = false;
  };

  const handlePreciseLocationClick = async () => {
    if (!onPreciseLocation) {
      return;
    }

    await onPreciseLocation();
    setConfirmationState("pending");
    userConfirmedRef.current = false;
  };

  const confirmationLabel =
    displayAddress || address || (hasCoordinates ? `${currentLatitude.toFixed(4)}, ${currentLongitude.toFixed(4)}` : "");

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <RenderCoreIcon name="MapPin" size={22} className="text-red-500" />
              GPS location
            </CardTitle>
            <CardDescription>{confirmationLabel || "Click on the map to choose your location"}</CardDescription>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600"
            aria-label="Expand map"
          >
            <RenderCoreIcon name="ArrowsOutSimple" size={22} />
          </button>
        </div>
      </CardHeader>

      <div className="px-6 pb-6">
        {hasCoordinates && confirmationState === "pending" && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-900">Is this your current location?</p>
                <p className="mt-1 text-sm text-amber-800">{confirmationLabel}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleConfirmLocation}
                  className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
                >
                  Yes, correct
                </button>
                <button
                  type="button"
                  onClick={handleFixLocation}
                  className="rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {hasCoordinates && confirmationState === "confirmed" && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-900">Location confirmed</p>
                <p className="mt-1 text-sm text-emerald-800">{confirmationLabel}</p>
              </div>

              <button
                type="button"
                onClick={handleChangeLocation}
                className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
              >
                Change
              </button>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-5">
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="satellite">Satellite</TabsTrigger>
          </TabsList>

          {!isExpanded && (
            <MapView
              latitude={currentLatitude}
              longitude={currentLongitude}
              centerLatitude={centerLatitude}
              centerLongitude={centerLongitude}
              recenterVersion={recenterVersion + recenterToken}
              zoomLevel={zoomLevel}
              activeTab={activeTab}
              onLocationSelect={handleMapSelect}
              onZoomChange={handleZoom}
              showZoomControls
              showHints
            />
          )}
        </Tabs>
      </div>

      {/* Location Coordinates */}
      <div className="px-6 py-4 border-t flex items-center justify-between">
        <div className="flex flex-col gap-1 text-sm text-gray-600">
          <p>{coordinates}</p>
          <p className="text-xs text-gray-500">Use precise location to refresh your current coordinates. Double click on the map to change location.</p>
        </div>
        <div className="flex items-center gap-3">
          {onPreciseLocation && (
            <button
              onClick={handlePreciseLocationClick}
              disabled={preciseLoading}
              className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 disabled:opacity-60"
            >
              <RenderCoreIcon name="MapPin" size={16} />
              {preciseLoading ? "Locating..." : "Precise location"}
            </button>
          )}
          <button
            onClick={handleOpenInMaps}
            className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <RenderCoreIcon name="ArrowSquareOut" size={16} />
            Open in maps
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-6xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold">Select location</h3>
                <p className="text-sm text-gray-500">Double click anywhere on the map to update the location on the page.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="map">Map</TabsTrigger>
                    <TabsTrigger value="satellite">Satellite</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <MapView
                latitude={currentLatitude}
                longitude={currentLongitude}
                centerLatitude={centerLatitude}
                centerLongitude={centerLongitude}
                recenterVersion={recenterVersion + recenterToken}
                zoomLevel={zoomLevel}
                activeTab={activeTab}
                onLocationSelect={handleMapSelect}
                onZoomChange={handleZoom}
                heightClass="h-[70vh]"
                showHints={false}
                showZoomControls
              />

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
