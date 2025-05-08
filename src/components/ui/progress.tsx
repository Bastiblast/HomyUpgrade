import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  color,
  duration,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {

  return (
    <div>
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
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("bg-primary h-full w-full flex-1" ,color,duration)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)`}}
      />
    </ProgressPrimitive.Root>
      </div>
  )
}

export { Progress }
