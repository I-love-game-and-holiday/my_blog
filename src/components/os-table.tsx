'use client'

import { OsTabsProvider, OsTabButtons, useOsTabs, type OsType } from './os-tabs'

interface OsTableProps {
    headers: string[]
    mac: string[][]
    windows: string[][]
    caption?: string
}

function TableContent({ headers, mac, windows, caption }: OsTableProps) {
    const { activeOs } = useOsTabs()
    const rows = activeOs === 'mac' ? mac : windows

    return (
        <figure className="my-6">
            <div className="rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                <OsTabButtons />
                <div className="overflow-x-auto">
                    <table
                        className="w-full text-sm"
                        style={{ borderCollapse: 'separate', borderSpacing: 0 }}
                    >
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
            </div>
            {caption && (
                <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                    {caption}
                </figcaption>
            )}
        </figure>
    )
}

export function OsTable(props: OsTableProps) {
    return (
        <OsTabsProvider>
            <TableContent {...props} />
        </OsTabsProvider>
    )
}
