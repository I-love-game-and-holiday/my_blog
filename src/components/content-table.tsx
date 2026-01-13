import type { ReactNode } from 'react'

interface ContentTableProps {
    headers: string[]
    rows: string[][]
    caption?: string
}

export function ContentTable({ headers, rows, caption }: ContentTableProps) {
    return (
        <figure className="my-6">
            <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-600">
                <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className={`border-b border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 ${index < headers.length - 1 ? 'border-r' : ''}`}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            >
                                {row.map((cell, cellIndex) => (
                                    <td
                                        key={cellIndex}
                                        className={`px-4 py-3 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 ${rowIndex < rows.length - 1 ? 'border-b' : ''} ${cellIndex < row.length - 1 ? 'border-r' : ''}`}
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {caption && (
                <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                    {caption}
                </figcaption>
            )}
        </figure>
    )
}

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
                <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                    {caption}
                </figcaption>
            )}
        </figure>
    )
}

interface FlowDiagramProps {
    steps: string[]
    caption?: string
}

export function FlowDiagram({ steps, caption }: FlowDiagramProps) {
    return (
        <figure className="my-6">
            <div className="flex flex-wrap items-center justify-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                {steps.map((step, index) => (
                    <span key={index} className="flex items-center">
                        <span className="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
                            {step}
                        </span>
                        {index < steps.length - 1 && (
                            <span className="mx-2 text-gray-400 dark:text-gray-500">→</span>
                        )}
                    </span>
                ))}
            </div>
            {caption && (
                <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                    {caption}
                </figcaption>
            )}
        </figure>
    )
}
