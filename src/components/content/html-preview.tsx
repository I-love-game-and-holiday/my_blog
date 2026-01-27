'use client'

interface HtmlPreviewProps {
    html: string
    css?: string
    js?: string
    height?: number
    title?: string
}

export function HtmlPreview({
    html,
    css = '',
    js = '',
    height = 400,
    title,
}: HtmlPreviewProps) {
    const fullHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        ${css}
    </style>
</head>
<body>
    ${html}
    ${js ? `<script>${js}</script>` : ''}
</body>
</html>
    `.trim()

    return (
        <figure className="my-6">
            {title && (
                <figcaption className="mb-2 text-sm font-medium text-muted-foreground">
                    {title}
                </figcaption>
            )}
            <div
                className="overflow-hidden rounded-lg border-2 border-border bg-white"
                style={{ height }}
            >
                <iframe
                    srcDoc={fullHtml}
                    className="w-full h-full"
                    sandbox="allow-scripts allow-forms"
                    title={title || 'HTML Preview'}
                />
            </div>
        </figure>
    )
}
