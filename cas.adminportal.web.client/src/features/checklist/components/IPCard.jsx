import { Card } from "@shared/components/ui/card";
import { RenderCoreIcon } from "@shared/core_icons/CoreIcons";

export default function IPCard({ ip = "0.0.0.0", location = "Unknown" }) {
  return (
    <Card className="p-4 md:p-5 gap-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">Public IP address</h3>
          <p className="text-2xl font-bold mt-2 font-mono">{ip}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Connected - {location}
          </div>
        </div>
        <RenderCoreIcon 
          name="Monitor" 
          size={20} 
          className="text-red-500"
          weight="duotone"
        />
      </div>
    </Card>
  );
}
