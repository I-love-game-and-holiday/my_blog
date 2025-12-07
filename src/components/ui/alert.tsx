import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { TipsAndUpdates as TipsAndUpdatesIcon } from '@mui/icons-material'

const alertVariants = cva(
  "relative my-4 rounded-lg border-l-4 p-4",
  {
    variants: {
      variant: {
        default:
          "border-blue-500 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-400",
        tip:
          "border-blue-500 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-400",
        note:
          "border-blue-400 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-400",
        warning:
          "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-400",
        important:
          "border-red-500 bg-red-50 dark:bg-red-950/20 dark:border-red-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const titleMap = {
  default: "TIP",
  tip: "TIP",
  note: "ポイント",
  warning: "WARNING",
  important: "IMPORTANT",
}

const iconMap = {
  default: "💡",
  tip: "💡",
  note: null, // Material-UIアイコンを使用
  warning: "⚠️",
  important: "❗",
}

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
}

function Alert({
  className,
  variant = "tip",
  children,
  ...props
}: AlertProps) {
  const currentVariant = variant || "tip"
  const icon = iconMap[currentVariant]
  const title = titleMap[currentVariant]

  return (
    <div
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0" aria-hidden="true">
          {currentVariant === "note" ? (
            <TipsAndUpdatesIcon className="h-2.5 w-2.5" />
          ) : (
            <span className="text-xl leading-none mt-0.5">{icon}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold mb-1.5 text-foreground">
            {title}
          </div>
          <div className="text-sm text-foreground/90 [&>p]:mb-2 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export { Alert, alertVariants }

