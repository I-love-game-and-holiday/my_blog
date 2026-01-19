interface SectionSummaryProps {
    points: string[]
}

export function SectionSummary({ points }: SectionSummaryProps) {
    if (points.length === 0) {
        return null
    }

    return (
        <div className="relative my-4 rounded-lg border-l-4 border-green-500 bg-green-50 p-4 dark:border-green-400 dark:bg-green-950/20">
            <ul className="space-y-1">
                {points.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">✓</span>
                        <span>{point}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
