"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ArrowRight, Menu, Lightbulb, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

export type Button7Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string
  asChild?: boolean
  icon?: "arrow" | "menu" | "bulb" | "theme"
  iconLabel?: string
  expandedWidth?: number
}

export const Component = React.forwardRef<HTMLButtonElement, Button7Props>(
  ({ label = "Visit", asChild = false, icon = "arrow", iconLabel, expandedWidth, className, children, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const child = asChild ? React.Children.only(children) as React.ReactElement : null
    const content = <>
      <span className="button-7-label">{label}</span>
      <span className={cn("button-7-arrow", icon === "menu" && "button-7-menu")} aria-hidden="true">{iconLabel ?? (icon === "menu" ? <Menu size={20} /> : icon === "bulb" ? <Lightbulb size={20} /> : icon === "theme" ? <><Sun size={20} className="theme-icon-sun" /><Moon size={20} className="theme-icon-moon" /></> : <ArrowRight size={20} />)}</span>
    </>
    return <Comp ref={ref} type={asChild ? undefined : "button"} aria-label={label}
      className={cn("button-7 group relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-black text-white border-2 border-black font-medium transition-all duration-300", className)}
      style={{ "--button-7-width": `${expandedWidth ?? Math.max(128,72 + label.length * 8)}px`, ...style } as React.CSSProperties} {...props}>
      {child ? React.cloneElement(child, {}, content) : content}
    </Comp>
  },
)
Component.displayName = "Button7"
