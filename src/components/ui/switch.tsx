import React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function Switch({ checked, onCheckedChange, className }: SwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "group relative inline-flex h-5 w-8 cursor-pointer items-center justify-start",
        className
      )}
    >
      <div
        className={cn(
          "absolute h-4 w-4 rounded-full transition-all duration-200",
          checked ? "translate-x-4 bg-white" : "translate-x-0 bg-zinc-400"
        )}
      />
    </button>
  );
}
