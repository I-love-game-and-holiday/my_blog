interface BoxDiagramProps {
    outer: {
        label: string
        description?: string
    }
    inner: {
        label: string
        description?: string
    }
    caption?: string
}

export function BoxDiagram({ outer, inner, caption }: BoxDiagramProps) {
    return (
        <figure className="my-6" style={{ maxWidth: 400 }}>
            <div className="rounded-lg border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/30 p-4">
                <div className="text-center text-sm font-bold text-blue-700 dark:text-blue-400 mb-2">
                    {outer.label}
                </div>
                {outer.description && (
                    <div className="text-center text-xs text-blue-600 dark:text-blue-500 mb-3">
                        {outer.description}
                    </div>
                )}
                <div className="rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-950/30 p-4">
                    <div className="text-center text-sm font-bold text-green-700 dark:text-green-400">
                        {inner.label}
                    </div>
                    {inner.description && (
                        <div className="text-center text-xs text-green-600 dark:text-green-500 mt-1">
                            {inner.description}
                        </div>
                    )}
                </div>
            </div>
            {caption && (
                <figcaption className="figure-caption">{caption}</figcaption>
            )}
        </figure>
    )
}
