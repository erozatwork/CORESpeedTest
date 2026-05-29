import { useState } from "react";
import { Button } from "@shared/components/ui/button";
import { speedTestWithProgress } from "../utils/speedTest";

export default function SpeedTestButton({ onSpeedTestComplete, disabled = false }) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ stage: "", progress: 0 });
  const [error, setError] = useState(null);

  const handleRunTest = async () => {
    if (isRunning || disabled) return;

    setIsRunning(true);
    setError(null);
    setProgress({ stage: "", progress: 0 });

    try {
      const results = await speedTestWithProgress({
        onProgress: (progressUpdate) => {
          setProgress(progressUpdate);
        },
      });

      if (results.error) {
        setError(results.error);
      } else {
        // Call the callback with the test results
        if (onSpeedTestComplete) {
          onSpeedTestComplete({
            downloadSpeed: results.downloadMbps ?? null,
            uploadSpeed: results.uploadMbps ?? null,
            latency: results.latencyMs ?? null,
          });
        }
      }
    } catch (err) {
      setError(err.message || "Speed test failed");
      console.error("Speed test error:", err);
    } finally {
      setIsRunning(false);
    }
  };

  const getButtonText = () => {
    if (!isRunning) return "Run Speed Test";

    const stageLabels = {
      ping: "Testing latency...",
      download: "Testing download...",
      upload: "Testing upload...",
    };

    return stageLabels[progress.stage] || "Running speed test...";
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleRunTest}
        disabled={isRunning || disabled}
        type="button"
        className="w-full justify-center font-semibold shadow-md"
        variant={isRunning ? "secondary" : "primary"}
        size="lg"
        radius="full"
      >
        {getButtonText()}
      </Button>

      {isRunning && progress.stage && (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">{progress.progress}%</span>
        </div>
      )}

      {error && (
        <div className="text-xs text-red-500 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
