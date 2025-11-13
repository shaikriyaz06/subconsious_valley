"use client";
import { cn } from "@/lib/utils";

export function CustomProgress({ percent, showInfo = true, strokeColor = "#0d9488", className }) {
  return (
    <div className={cn("w-full", className)}>
      <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-300 ease-out rounded-full"
          style={{
            width: `${Math.min(Math.max(percent || 0, 0), 100)}%`,
            backgroundColor: strokeColor
          }}
        />
      </div>
      {showInfo && (
        <div className="text-xs text-gray-600 mt-1 text-right">
          {Math.round(percent || 0)}%
        </div>
      )}
    </div>
  );
}