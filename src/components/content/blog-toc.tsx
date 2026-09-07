import type { HeadingItem } from '@/lib/mdx'

interface BlogTocProps {
    headings: HeadingItem[]
}

interface HeadingGroup {
    heading: HeadingItem
    children: HeadingItem[]
}

/** h2を区切りとして、h3/h4をその子としてグルーピングする */
function groupHeadings(headings: HeadingItem[]): HeadingGroup[] {
    const groups: HeadingGroup[] = []

    for (const heading of headings) {
        const lastGroup = groups[groups.length - 1]

        if (heading.level === 2 || !lastGroup) {
            groups.push({ heading, children: [] })
        } else {
            lastGroup.children.push(heading)
        }
    }

    return groups
}

/**
 * ブログ記事用の目次
 *
 * ネイティブのdetails/summaryで開閉するインラインTOC。
 * サイドパネルではなく本文内（導入文の後、本文の前）に配置する想定。
 * h3/h4はh2ごとにグルーピングし、縦のガイド線でネストを表現する。
 */
export function BlogToc({ headings }: BlogTocProps) {
    if (headings.length === 0) {
        return null
    }

    const groups = groupHeadings(headings)

    return (
        <details
            open
            className="not-prose mb-8 rounded-lg border border-border bg-secondary/30 p-4"
        >
            <summary className="cursor-pointer text-sm font-semibold">
                目次
            </summary>
            <ul className="mt-3 space-y-1.5">
                {groups.map((group) => (
                    <li key={group.heading.id}>
                        <a
                            href={`#${group.heading.id}`}
                            className="block text-sm font-medium text-foreground hover:text-foreground/80 transition-colors py-0.5"
                        >
                            {group.heading.text}
                        </a>
                        {group.children.length > 0 && (
                            <ul className="mt-1 space-y-1 border-l border-border pl-3">
                                {group.children.map((child) => (
                                    <li key={child.id}>
                                        <a
                                            href={`#${child.id}`}
                                            className={`
                                                block text-sm text-muted-foreground hover:text-foreground
                                                transition-colors py-0.5
                                                ${child.level === 4 ? 'pl-3' : ''}
                                            `}
                                        >
                                            {child.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </details>
    )
}
