import { Alert } from '@/components/ui/alert'

interface CourseGoalsProps {
    goals: string[]
}

export function CourseGoals({ goals }: CourseGoalsProps) {
    if (goals.length === 0) {
        return null
    }

    return (
        <Alert variant="note" title="このコースで身につくスキル" hideIcon>
            <ul className="space-y-1">
                {goals.map((goal, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <span className="text-foreground/60">-</span>
                        <span>{goal}</span>
                    </li>
                ))}
            </ul>
        </Alert>
    )
}
