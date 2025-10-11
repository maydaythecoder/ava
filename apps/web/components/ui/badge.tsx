import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-slate-100 text-black shadow hover:bg-slate-200",
        secondary:
          "border-transparent bg-slate-100 text-black hover:bg-slate-200",
        destructive:
          "border-transparent bg-red-100 text-black shadow hover:bg-red-200",
        outline: "border-slate-300 text-black",
        warning: "border-transparent bg-yellow-100 text-black shadow hover:bg-yellow-200",
        info: "border-transparent bg-blue-100 text-black shadow hover:bg-blue-200",
        success: "border-transparent bg-green-100 text-black shadow hover:bg-green-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

