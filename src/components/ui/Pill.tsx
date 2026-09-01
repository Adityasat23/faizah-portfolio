import React from "react";
import { cn } from "@/lib/utils";

interface PillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function Pill({ active, className, children, ...props }: PillProps) {
  return (
    <button
      className={cn(
        "px-6 py-2 rounded-full text-label border transition-all duration-300",
        active 
          ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]" 
          : "bg-transparent text-[var(--foreground)] border-[var(--foreground)]/30 hover:border-[var(--foreground)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
