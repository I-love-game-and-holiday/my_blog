interface ContentTableProps {
    headers: string[]
    rows: string[][]
    caption?: string
}

export function ContentTable({ headers, rows, caption }: ContentTableProps) {
    return (
        <figure className="my-6">
            <div className="content-table-wrapper">
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
            {caption && (
                <figcaption className="figure-caption">{caption}</figcaption>
            )}
        </figure>
    )
}
