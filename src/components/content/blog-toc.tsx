import type { HeadingItem } from '@/lib/mdx'

interface BlogTocProps {
    headings: HeadingItem[]
}

/**
 * ブログ記事用の目次
 *
 * ネイティブのdetails/summaryで開閉するインラインTOC。
 * サイドパネルではなく本文内（導入文の後、本文の前）に配置する想定。
 */
export function BlogToc({ headings }: BlogTocProps) {
    if (headings.length === 0) {
        return null
    }

    return (
        <details
            open
            className="not-prose mb-8 rounded-lg border border-border bg-secondary/30 p-4"
        >
            <summary className="cursor-pointer text-sm font-semibold">
                目次
            </summary>
            <ul className="mt-3 space-y-1.5">
                {headings.map((heading) => (
                    <li key={heading.id}>
                        <a
                            href={`#${heading.id}`}
                            className={`
                                block text-sm text-muted-foreground hover:text-foreground
                                transition-colors py-0.5
                                ${heading.level === 2 ? 'font-medium text-foreground' : ''}
                                ${heading.level === 3 ? 'pl-3' : ''}
                                ${heading.level === 4 ? 'pl-6' : ''}
                            `}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </details>
    )
}
