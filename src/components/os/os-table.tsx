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
            <div className="rounded-lg border border-border overflow-hidden">
                <OsTabButtons />
                <div className="overflow-x-auto">
                    <table className="content-table">
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {caption && (
                <figcaption className="figure-caption">{caption}</figcaption>
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
