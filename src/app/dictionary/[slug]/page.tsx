import Link from 'next/link'
import { getDictionaryEntry, getDictionarySlugs } from '@/lib/get-dictionary'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

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

    return {
        title: entry?.term ? `${entry.term} - 用語辞典` : '用語辞典',
        description: entry?.term ? `${entry.term}の解説` : undefined,
    }
}

export default async function DictionaryEntryPage(props: PageProps) {
    const params = await props.params
    const entry = await getDictionaryEntry(params.slug)

    if (!entry) {
        notFound()
    }

    return (
        <div className="container py-12">
            {/* Breadcrumb */}
            <nav className="text-sm text-muted-foreground mb-6">
                <Link href="/dictionary" className="hover:text-foreground transition-colors">
                    用語辞典
                </Link>
                <span className="mx-2">/</span>
                <span className="text-foreground">
                    {entry.term}
                </span>
            </nav>

            <article className="prose max-w-none">
                <header className="mb-8 not-prose">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
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
