import { Card } from "@shared/components/ui/card";
import { Badge } from "@shared/components/ui/badge";
import { RenderCoreIcon } from "@shared/core_icons/CoreIcons";

export default function StatusBar({
  deviceStatus = "online",
  signal = "strong",
  cameraStatus = "offline",
  lastSync = null,
  battery = 74,
}) {
  const getDeviceStatusColor = (status) => {
    return status === "online" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getSignalColor = (signal) => {
    const colors = {
      strong: "bg-blue-100 text-blue-800",
      medium: "bg-yellow-100 text-yellow-800",
      weak: "bg-orange-100 text-orange-800",
    };
    return colors[signal] || colors.strong;
  };

  const getCameraStatusColor = (status) => {
    return status === "online" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800";
  };

  const formatLastSync = (date) => {
    if (!date) return "Never";
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);
    return `${diffInMinutes} min ago`;
  };

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-6">
        {/* Device Status */}
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${deviceStatus === "online" ? "bg-green-500" : "bg-red-500"}`}></span>
          <span className="text-sm font-medium">Device</span>
          <Badge className={`text-xs font-medium ${getDeviceStatusColor(deviceStatus)}`} variant="outline">
            {deviceStatus.charAt(0).toUpperCase() + deviceStatus.slice(1)}
          </Badge>
        </div>

        {/* Signal Strength */}
        <div className="flex items-center gap-2">
          <RenderCoreIcon name="WifiHigh" size={16} />
          <span className="text-sm font-medium">Signal</span>
          <Badge className={`text-xs font-medium ${getSignalColor(signal)}`} variant="outline">
            {signal.charAt(0).toUpperCase() + signal.slice(1)}
          </Badge>
        </div>

        {/* Camera Status */}
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${cameraStatus === "online" ? "bg-green-500" : "bg-orange-500"}`}></span>
          <span className="text-sm font-medium">Camera</span>
          <Badge className={`text-xs font-medium ${getCameraStatusColor(cameraStatus)}`} variant="outline">
            {cameraStatus.charAt(0).toUpperCase() + cameraStatus.slice(1)}
          </Badge>
        </div>

        {/* Last Sync */}
        <div className="flex items-center gap-2">
          <RenderCoreIcon name="Clock" size={16} />
          <span className="text-sm font-medium">Last sync</span>
          <span className="text-xs text-gray-600">{formatLastSync(lastSync)}</span>
        </div>

        {/* Battery */}
        <div className="flex items-center gap-2 ml-auto">
          <RenderCoreIcon name="Battery" size={16} />
          <span className="text-sm font-medium">{battery}%</span>
        </div>
      </div>
    </Card>
  );
}
