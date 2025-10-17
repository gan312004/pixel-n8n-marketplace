"use client"

import { cn } from "@/lib/utils"
import { CSSProperties, FC, ReactNode } from "react"

interface ShinyTextProps {
  children: ReactNode
  className?: string
  shimmerWidth?: number
}

export const ShinyText: FC<ShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
}) => {
  return (
    <span
      style={
        {
          "--shimmer-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        "inline-block text-muted-foreground",
        "animate-shimmer bg-clip-text bg-no-repeat",
        "[background-position:0_0] [background-size:var(--shimmer-width)_100%]",
        "[transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",
        "bg-gradient-to-r from-transparent via-foreground/80 via-50% to-transparent",
        className
      )}
    >
      {children}
    </span>
  )
}