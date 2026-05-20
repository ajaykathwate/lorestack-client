import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[44px] w-full rounded-[6px] border border-line bg-bg px-3 text-[14px] text-ink",
          "placeholder:text-ink-3",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ls-accent focus-visible:border-ls-accent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
