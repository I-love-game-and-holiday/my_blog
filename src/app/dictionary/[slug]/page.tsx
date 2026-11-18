import Link from 'next/link'
import { getDictionaryEntry, getDictionarySlugs } from '@/lib/get-dictionary'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'
import { Breadcrumb } from '@/components/layout/breadcrumb'

type PageParams = {
    slug: string
}

type PageProps = {
    params: Promise<PageParams>
}

export async function generateStaticParams() {
    const slugs = getDictionarySlugs()
    return slugs.map(slug => ({ slug }))
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params
    const entry = await getDictionaryEntry(params.slug)
    if (!entry) return {}

    return buildPageMetadata({
        title: `${entry.term} - 用語辞典`,
        description: `${entry.term}の解説`,
        path: entry.route,
    })
}

export default async function DictionaryEntryPage(props: PageProps) {
    const params = await props.params
    const entry = await getDictionaryEntry(params.slug)

    if (!entry) {
        notFound()
    }

    return (
        <div className="container py-12">
            {/* パンくずリスト */}
            <Breadcrumb
                items={[
                    { label: '用語辞典', href: '/dictionary' },
                    { label: entry.term },
                ]}
            />

            <article className="prose max-w-none">
                <header className="mb-8 not-prose">
                    <h1 className="text-page-title font-bold tracking-tight mb-2">
                        {entry.term}
                    </h1>
                    {entry.aliases.length > 0 && (
                        <p className="text-muted-foreground">
                            別名: {entry.aliases.join(', ')}
                        </p>
                    )}
                </header>
                {entry.content}
            </article>

            <div className="mt-12 pt-8 border-t border-border">
                <Link
                    href="/dictionary"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    ← 用語辞典に戻る
                </Link>
            </div>
        </div>
    )
}
