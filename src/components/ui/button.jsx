import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({ className, variant = "default", size = "default", ...props }) {
  const base =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-neutral-900 text-white hover:bg-neutral-800",
    outline: "border border-neutral-300 bg-white hover:bg-neutral-100",
    secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}