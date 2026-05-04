import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-neutral-900 text-white",
    secondary: "bg-neutral-100 text-neutral-900",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}