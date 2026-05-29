import { Card, CardHeader, CardTitle } from "@shared/components/ui/card";
import { RenderCoreIcon } from "@shared/core_icons/CoreIcons";
import { Badge } from "@shared/components/ui/badge";

/**
 * ChecklistSidebar Component
 * Displays checklist items in a summary format for the sidebar
 * Shows current checklist status and recent entries
 */
export default function ChecklistSidebar({
  downloadSpeed = 0,
  uploadSpeed = 0,
  publicIp = "0.0.0.0",
  address = "Unknown",
  latitude = null,
  longitude = null,
  lastSync = null,
  deviceStatus = "online",
  signal = "strong",
  cameraStatus = "offline",
  battery = 74,
}) {
  const formatLastSync = (date) => {
    if (!date) return "Never";
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    return diffInHours < 24 ? `${diffInHours}h ago` : "Today";
  };

  const getStatusColor = (status) => {
    return status === "online" || status === "strong"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <CardTitle className="text-sm font-semibold mb-4 flex items-center gap-2">
          <RenderCoreIcon name="CheckCircle" size={16} />
          Checklist Summary
        </CardTitle>

        {/* Status Items */}
        <div className="space-y-3">
          {/* Download Speed */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <RenderCoreIcon name="ArrowDown" size={14} className="text-blue-500" />
              <span>Download</span>
            </div>
            <span className="font-semibold">{downloadSpeed.toFixed(1)} Mbps</span>
          </div>

          {/* Upload Speed */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <RenderCoreIcon name="ArrowUp" size={14} className="text-green-500" />
              <span>Upload</span>
            </div>
            <span className="font-semibold">{uploadSpeed.toFixed(1)} Mbps</span>
          </div>

          {/* Public IP */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <RenderCoreIcon name="MapPin" size={14} className="text-red-500" />
              <span>IP</span>
            </div>
            <span className="font-mono text-xs font-semibold">{publicIp}</span>
          </div>

          {/* Location */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <RenderCoreIcon name="MapPinLine" size={14} className="text-orange-500" />
              <span>Location</span>
            </div>
            <span className="text-xs truncate max-w-[120px]">{address}</span>
          </div>

          <hr className="my-3" />

          {/* Device Status */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Device</span>
            <Badge className={`text-xs ${getStatusColor(deviceStatus)}`} variant="outline">
              {deviceStatus === "online" ? "🟢 Online" : "🔴 Offline"}
            </Badge>
          </div>

          {/* Signal Strength */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Signal</span>
            <Badge className={`text-xs ${getStatusColor(signal)}`} variant="outline">
              <RenderCoreIcon name="WifiHigh" size={12} className="mr-1" />
              {signal === "strong"
                ? "Strong"
                : signal === "medium"
                ? "Medium"
                : "Weak"}
            </Badge>
          </div>

          {/* Camera Status */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Camera</span>
            <Badge
              className={`text-xs ${
                cameraStatus === "online"
                  ? "bg-green-100 text-green-800"
                  : "bg-orange-100 text-orange-800"
              }`}
              variant="outline"
            >
              {cameraStatus === "online" ? "🟢 Online" : "🟠 Offline"}
            </Badge>
          </div>

          {/* Battery */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Battery</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    battery > 50
                      ? "bg-green-500"
                      : battery > 20
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${battery}%` }}
                ></div>
              </div>
              <span className="text-xs font-semibold">{battery}%</span>
            </div>
          </div>

          {/* Last Sync */}
          <div className="flex items-center justify-between text-sm pt-2 border-t">
            <span className="text-gray-600">Last sync</span>
            <span className="text-xs text-gray-500">{formatLastSync(lastSync)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
