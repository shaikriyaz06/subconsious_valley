"use client";
import { cn } from "@/lib/utils";

export function CustomTabs({ activeKey, onChange, items, centered = false, className }) {
  return (
    <div className={cn("w-full", className)}>
      <div className={cn(
        "flex border-b border-gray-200",
        centered && "justify-center"
      )}>
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors relative cursor-pointer",
              "hover:text-teal-600 focus:outline-none",
              activeKey === item.key
                ? "text-teal-600 border-b-2 border-teal-600"
                : "text-gray-600"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}