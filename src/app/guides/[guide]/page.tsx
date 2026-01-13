import Link from 'next/link'
import { getGuide, getGuideSlugs } from '@/lib/get-guides'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ClickableCard } from '@/components/ui/clickable-card'

type PageParams = {
    guide: string
}

type PageProps = {
    params: Promise<PageParams>
}

export async function generateStaticParams() {
    const slugs = getGuideSlugs()
    return slugs.map(guide => ({ guide }))
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params
    const guide = await getGuide(params.guide)
    if (!guide) return {}
    return {
        title: guide.frontMatter?.title || guide.title,
        description: guide.frontMatter?.description,
    }
}

export default async function GuidePage(props: PageProps) {
    const params = await props.params
    const guide = await getGuide(params.guide)

    if (!guide) {
        notFound()
    }

    return (
        <div className="container py-12">
            <div className="mb-8">
                <Link
                    href="/guides"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block"
                >
                    ← ガイド一覧に戻る
                </Link>
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                    {guide.frontMatter?.title || guide.title}
                </h1>
                {guide.frontMatter?.description && (
                    <p className="text-muted-foreground">
                        {guide.frontMatter.description}
                    </p>
                )}
            </div>

            {guide.sections.length === 0 ? (
                <p className="text-muted-foreground">まだセクションがありません。</p>
            ) : (
                <div className="space-y-3">
                    {guide.sections.map((section, index) => (
                        <ClickableCard key={section.route} href={section.route}>
                            <div className="flex items-center gap-4">
                                <span className="flex items-center justify-center w-8 h-8 text-sm font-medium bg-secondary rounded-full shrink-0">
                                    {index + 1}
                                </span>
                                <div>
                                    <h3 className="font-medium group-hover:underline">
                                        {section.frontMatter?.title || section.title}
                                    </h3>
                                    {section.frontMatter?.description && (
                                        <p className="text-sm text-muted-foreground">
                                            {section.frontMatter.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </ClickableCard>
                    ))}
                </div>
            )}

            {guide.sections.length > 0 && (
                <div className="mt-8 pt-8 border-t border-border">
                    <Link
                        href={guide.sections[0].route}
                        className="inline-flex items-center justify-center px-6 py-3 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors"
                    >
                        読み始める
                    </Link>
                </div>
            )}
        </div>
    )
}
