import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export function Tabs(props) {
  return <TabsPrimitive.Root {...props} />;
}

export function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium text-neutral-600 transition-all data-[state=active]:bg-neutral-900 data-[state=active]:text-white",
        className
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }) {
  return <TabsPrimitive.Content className={cn(className)} {...props} />;
}