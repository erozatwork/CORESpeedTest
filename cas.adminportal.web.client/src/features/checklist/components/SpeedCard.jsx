import { Card } from "@shared/components/ui/card";
import { RenderCoreIcon } from "@shared/core_icons/CoreIcons";

export default function SpeedCard({
  title = "Download speed",
  speed = 0,
  unit = "Mbps",
  comparison = null,
  icon = "Download",
  comparisonColor = "text-green-600",
}) {
  const formattedSpeed = Number(speed ?? 0);
  const speedLabel =
    formattedSpeed === 0 ? `00 ${unit}` : `${formattedSpeed.toFixed(1)} ${unit}`;

  return (
    <Card className="p-4 md:p-5 gap-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">{title}</h3>
          <p className="text-2xl font-bold mt-2">
            {speedLabel}
          </p>
        </div>
        <RenderCoreIcon
          name={icon}
          size={20}
          className={icon === "Download" ? "text-blue-500" : "text-green-500"}
          weight="duotone"
        />
      </div>

      {comparison && (
        <div className={`text-xs font-medium flex items-center gap-1 ${comparisonColor}`}>
          <RenderCoreIcon
            name={comparisonColor.includes("green") ? "TrendingUp" : "TrendingDown"}
            size={14}
            weight="duotone"
          />
          {comparison}
        </div>
      )}
    </Card>
  );
}
