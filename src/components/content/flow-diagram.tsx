interface FlowDiagramProps {
    steps: string[]
    caption?: string
}

export function FlowDiagram({ steps, caption }: FlowDiagramProps) {
    return (
        <figure className="my-6">
            <div className="flex flex-wrap items-center justify-center gap-2 p-4 rounded-lg bg-secondary/50">
                {steps.map((step, index) => (
                    <span key={index} className="flex items-center">
                        <span className="px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground whitespace-nowrap">
                            {step}
                        </span>
                        {index < steps.length - 1 && (
                            <span className="mx-2 text-muted-foreground">→</span>
                        )}
                    </span>
                ))}
            </div>
            {caption && (
                <figcaption className="figure-caption">{caption}</figcaption>
            )}
        </figure>
    )
}
