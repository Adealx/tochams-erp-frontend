"use client";

interface ProgressBarProps {
  progress: number;
  label?: string;
}

export default function ProgressBar({
  progress,
  label = "Uploading...",
}: ProgressBarProps) {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>

      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}