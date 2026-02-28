import { type ReactNode } from 'react'
import { ClipboardCheck } from 'lucide-react'

interface SummaryListProps {
    children: ReactNode
}

export function SummaryList({ children }: SummaryListProps) {
    return (
        <div className="summary-list">
            <div className="flex items-center gap-2 mb-3">
                <ClipboardCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="font-semibold text-sm text-green-700 dark:text-green-300">
                    ポイント
                </span>
            </div>
            <div className="summary-list-content">{children}</div>
        </div>
    )
}
