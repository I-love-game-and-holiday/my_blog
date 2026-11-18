import Link from 'next/link'

/** パンくずリストの1項目。href がある項目はリンクになり、ない項目（通常は最後の現在ページ）は文字だけになる */
export type BreadcrumbItem = {
    label: string
    href?: string
}

type BreadcrumbProps = {
    items: BreadcrumbItem[]
}

/**
 * 記事ページ上部のパンくずリスト（例: Learn / コース名 / レッスン名）
 * 項目の間には「/」を入れる（区切り文字は読み上げない）
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav aria-label="パンくずリスト" className="text-sm text-muted-foreground mb-6">
            <ol className="flex flex-wrap items-center">
                {items.map((item, index) => (
                    <li key={`${index}-${item.label}`} className="flex items-center">
                        {index > 0 && <span aria-hidden="true" className="mx-2">/</span>}
                        {item.href ? (
                            <Link href={item.href} className="hover:text-foreground transition-colors">
                                {item.label}
                            </Link>
                        ) : (
                            <span aria-current="page" className="text-foreground">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}
