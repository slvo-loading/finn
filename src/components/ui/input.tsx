import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type = "text", placeholder = "Ask Anything", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground dark:bg-input/30",
        "border border-input rounded-md bg-transparent px-3 py-1 text-xs",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "w-full h-9 min-w-0",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
        className
      )}
      {...props}
    />
  )
}

export { Input }
