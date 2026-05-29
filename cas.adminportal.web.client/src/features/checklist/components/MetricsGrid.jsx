import SpeedCard from "./SpeedCard";
import IPCard from "./IPCard";
import SpeedTestButton from "./SpeedTestButton";

export default function MetricsGrid({
  downloadSpeed = 0,
  uploadSpeed = 0,
  publicIp = "0.0.0.0",
  downloadComparison = null,
  uploadComparison = null,
  location = "PH",
  onSpeedTestComplete = null,
  isLoading = false,
}) {
  const getDownloadComparisonColor = () => {
    if (!downloadComparison) return "text-gray-600";
    if (downloadComparison.includes("+")) return "text-green-600";
    if (downloadComparison.includes("-")) return "text-red-600";
    return "text-gray-600";
  };

  const getUploadComparisonColor = () => {
    if (!uploadComparison) return "text-gray-600";
    if (uploadComparison.includes("+")) return "text-green-600";
    if (uploadComparison.includes("-")) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SpeedCard
          title="Download speed"
          speed={downloadSpeed}
          unit="Mbps"
          icon="Download"
          comparison={downloadComparison}
          comparisonColor={getDownloadComparisonColor()}
        />
        <SpeedCard
          title="Upload speed"
          speed={uploadSpeed}
          unit="Mbps"
          icon="Upload"
          comparison={uploadComparison}
          comparisonColor={getUploadComparisonColor()}
        />
        <IPCard ip={publicIp} location={location} />
      </div>

      {/* Speed Test Button */}
      {onSpeedTestComplete && (
        <div className="max-w-sm">
          <SpeedTestButton
            onSpeedTestComplete={onSpeedTestComplete}
            disabled={isLoading}
          />
        </div>
      )}
    </div>
  );
}
