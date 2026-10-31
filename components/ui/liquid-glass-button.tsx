"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  { variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-primary-foreground hover:bg-destructive/90",
      cool: "bg-linear-to-t border border-b-2 border-zinc-950/40 from-primary to-primary/85 shadow-md shadow-primary/20 ring-1 ring-inset ring-white/25 hover:brightness-110 active:brightness-90 text-primary-foreground",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: { default: "h-9 px-4 py-2", sm: "h-8 rounded-md px-3 text-xs", lg: "h-10 rounded-md px-8", icon: "h-9 w-9" },
  }, defaultVariants: { variant: "default", size: "default" } },
)
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
})
Button.displayName = "Button"

const liquidbuttonVariants = cva(
  "liquid-glass-control inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-full text-sm font-medium shrink-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  { variants: {
    variant: {
      default: "bg-transparent text-primary",
      destructive: "bg-destructive text-white",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: { default: "h-9 px-4 py-2", sm: "h-8 text-xs px-4", lg: "h-10 px-6", xl: "h-12 px-8", xxl: "h-14 px-10", icon: "size-9" },
  }, defaultVariants: { variant: "default", size: "xxl" } },
)

export function GlassFilter({ id }: { id: string }) {
  return <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute", pointerEvents: "none" }}>
    <defs><filter id={id} x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="turbulence" />
      <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
      <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="70" xChannelSelector="R" yChannelSelector="B" result="displaced" />
      <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
      <feComposite in="finalBlur" in2="finalBlur" operator="over" />
    </filter></defs>
  </svg>
}

// Slot receives exactly one element. Decorative spans go inside that element,
// so anchors and native summary disclosures retain their own semantics.
const LiquidButton = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<"button"> & VariantProps<typeof liquidbuttonVariants> & { asChild?: boolean }>(
  ({ className, variant, size, asChild = false, children, style, ...props }, ref) => {
    const id = `liquid-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`
    const decorate = (content: React.ReactNode) => <>
      <span className="liquid-glass-refraction" aria-hidden="true" />
      <span className="liquid-glass-rim" aria-hidden="true" />
      <span className="liquid-glass-content">{content}</span>
    </>
    const child = asChild ? React.Children.only(children) as React.ReactElement<{ children?: React.ReactNode }> : null
    const Comp = asChild ? Slot : "button"
    return <>
      <Comp ref={ref} data-slot="button" className={cn(liquidbuttonVariants({ variant, size, className }))} style={{ "--liquid-filter": `url("#${id}")`, ...style } as React.CSSProperties} {...props}>
        {child ? React.cloneElement(child, {}, decorate(child.props.children)) : decorate(children)}
      </Comp>
      <GlassFilter id={id} />
    </>
  },
)
LiquidButton.displayName = "LiquidButton"

export type ColorVariant = "default" | "primary" | "success" | "error" | "gold" | "bronze"
export interface MetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: ColorVariant }
const metalColors: Record<ColorVariant, string> = {
  default: "from-[#B9B9B9] to-[#969696]", primary: "from-primary to-primary/40",
  success: "from-[#9ADBC8] to-[#3E8F7C]", error: "from-[#F08D8F] to-[#A45253]",
  gold: "from-[#FFEBA1] to-[#9B873F]", bronze: "from-[#FFE3C9] to-[#A36F3D]",
}
export const MetalButton = React.forwardRef<HTMLButtonElement, MetalButtonProps>(
  ({ children, className, variant = "default", style, ...props }, ref) => <button
    ref={ref} {...props}
    className={cn("relative inline-flex h-11 items-center justify-center rounded-md border border-black/30 bg-gradient-to-b px-6 py-2 text-sm font-semibold text-white shadow-md transition duration-200 hover:brightness-105 active:translate-y-0.5 active:scale-[.99] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2", metalColors[variant], className)}
    style={{ boxShadow: "inset 0 1px 1px #ffffffbb, inset 0 -1px 1px #00000044, 0 3px 8px #00000022", textShadow: "0 -1px 0 #00000055", ...style }}
  >{children || "Button"}</button>,
)
MetalButton.displayName = "MetalButton"
export { Button, buttonVariants, liquidbuttonVariants, LiquidButton }
