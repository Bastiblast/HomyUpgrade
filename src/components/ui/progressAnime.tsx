"use client";
import { cn } from "@/lib/utils";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";
export default function ProgressAnimationDemo({color,value}) {
    const {prev,next} = value || 0
  const [progress, setProgress] = React.useState(prev);
  React.useEffect(() => {
    setProgress(() => next);
  }, [value,prev,next]);
  return (
    <div className="w-[100%]">
      <style>
        {`@keyframes progress {
            to {
              left: calc(100% - 2rem);
            }
          }
          .progress {
            transform-origin: center;
            animation: progress 1.25s ease-in-out infinite;
          }
          `}
      </style>
      <ProgressPrimitive.Root className="relative bg-primary/20 rounded-full w-full h-2 overflow-hidden">
        <ProgressPrimitive.Indicator
          className={cn("relative flex-1 bg-primary w-full h-full transition-all duration-1000",color)}
          style={{ transform: `translateX(-${100 - (progress || 0)}%)` }}
        >
          <div className={"left-0 absolute inset-y-0 bg-primary-foreground blur-[10px] w-6 h-full progress"} />
        </ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>
    </div>
  );
}