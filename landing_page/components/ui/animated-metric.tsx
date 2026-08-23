"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AnimatedMetricProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedMetric({ children, className }: AnimatedMetricProps) {
  return (
    <span
      className={cn(
        "relative inline-block font-semibold text-zinc-100",
        "before:absolute before:left-0 before:-bottom-[2px] before:h-[2px] before:w-full before:bg-[#b02600] before:content-['']",
        "before:transition-transform before:duration-700 before:ease-[cubic-bezier(0.4,0,0.2,1)] before:origin-left",
        "before:scale-x-0 group-data-[settled=true]/caption:before:scale-x-100",
        className
      )}
    >
      {children}
    </span>
  );
}

export default AnimatedMetric;
