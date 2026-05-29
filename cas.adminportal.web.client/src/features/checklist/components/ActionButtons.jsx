import { Button } from "@shared/components/ui/button";
import { RenderCoreIcon } from "@shared/core_icons/CoreIcons";

export default function ActionButtons({
  onRetry,
  onSave,
  loading = false,
  isFormComplete = false,
}) {
  return (
    <div className="flex justify-end gap-3 pt-4">
      <Button
        variant="outline"
        onClick={onRetry}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <RenderCoreIcon name="ArrowCounterClockwise" size={16} />
        Retry
      </Button>

      <Button
        onClick={onSave}
        disabled={loading || !isFormComplete}
        className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
      >
        <RenderCoreIcon name="FolderPlus" size={16} />
        {loading ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
