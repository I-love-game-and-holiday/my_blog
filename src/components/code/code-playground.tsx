import { CodePlaygroundClient } from './code-playground-client'

interface CodePlaygroundProps {
    html: string
    css?: string
    js?: string
    height?: number
    title?: string
}

export function CodePlayground({
    html,
    css = '',
    js = '',
    height = 300,
    title,
}: CodePlaygroundProps) {
    return (
        <CodePlaygroundClient
            html={html}
            css={css}
            js={js}
            height={height}
            title={title}
        />
    )
}
