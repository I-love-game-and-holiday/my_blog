import { ReactNode } from 'react'
import { Info, Lightbulb, AlertTriangle, AlertCircle } from 'lucide-react'

type CalloutType = 'info' | 'tip' | 'warning' | 'error'

interface CalloutProps {
    type?: CalloutType
    children: ReactNode
}

const calloutConfig: Record<
    CalloutType,
    {
        icon: typeof Info
        borderColor: string
        bgColor: string
        iconColor: string
    }
> = {
    info: {
        icon: Info,
        borderColor: 'border-blue-500 dark:border-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-950/20',
        iconColor: 'text-blue-600 dark:text-blue-400',
    },
    tip: {
        icon: Lightbulb,
        borderColor: 'border-amber-500 dark:border-amber-400',
        bgColor: 'bg-amber-50 dark:bg-amber-950/20',
        iconColor: 'text-amber-600 dark:text-amber-400',
    },
    warning: {
        icon: AlertTriangle,
        borderColor: 'border-orange-500 dark:border-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-950/20',
        iconColor: 'text-orange-600 dark:text-orange-400',
    },
    error: {
        icon: AlertCircle,
        borderColor: 'border-red-500 dark:border-red-400',
        bgColor: 'bg-red-50 dark:bg-red-950/20',
        iconColor: 'text-red-600 dark:text-red-400',
    },
}

export function Callout({ type = 'info', children }: CalloutProps) {
    const config = calloutConfig[type]
    const Icon = config.icon

    return (
        <div
            className={`relative my-4 rounded-lg border-l-4 p-4 ${config.borderColor} ${config.bgColor}`}
        >
            <div className="flex gap-3">
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${config.iconColor}`} />
                <div className="prose-sm [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
                    {children}
                </div>
            </div>
        </div>
    )
}
