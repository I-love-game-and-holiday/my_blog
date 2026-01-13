import Link from 'next/link'
import { getGuide, getGuides } from '@/lib/get-guides'
import { getSectionContent } from '@/lib/mdx'
import { getDictionaryEntries } from '@/lib/get-dictionary'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/article-layout'
import { MdxContentWrapper } from '@/components/mdx-components'
import { GuideSidebar } from '@/components/guide-sidebar'

type PageParams = {
    guide: string
    section: string
}

type PageProps = {
    params: Promise<PageParams>
}

export async function generateStaticParams() {
    const guides = await getGuides()
    const params: PageParams[] = []

    for (const guide of guides) {
        for (const section of guide.sections) {
            params.push({
                guide: guide.slug,
                section: section.slug,
            })
        }
    }

    return params
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params
    const guide = await getGuide(params.guide)
    const section = guide?.sections.find(s => s.slug === params.section)

    return {
        title: section?.frontMatter?.title,
        description: section?.frontMatter?.description,
    }
}

export default async function SectionPage(props: PageProps) {
    const params = await props.params
    const guide = await getGuide(params.guide)

    if (!guide) {
        notFound()
    }

    const result = await getSectionContent(params.guide, params.section)

    if (!result) {
        notFound()
    }

    const { metadata, content, headings } = result
    const dictionaryEntries = await getDictionaryEntries()

    // Find current section index and navigation
    const currentIndex = guide.sections.findIndex(s => s.slug === params.section)
    const prevSection = currentIndex > 0 ? guide.sections[currentIndex - 1] : null
    const nextSection = currentIndex < guide.sections.length - 1 ? guide.sections[currentIndex + 1] : null

    return (
        <ArticleLayout>
            <div className="container py-12">
                {/* Breadcrumb */}
                <nav className="text-sm text-muted-foreground mb-6">
                    <Link href="/guides" className="hover:text-foreground transition-colors">
                        Guides
                    </Link>
                    <span className="mx-2">/</span>
                    <Link href={guide.route} className="hover:text-foreground transition-colors">
                        {guide.frontMatter?.title || guide.title}
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">
                        {metadata?.title}
                    </span>
                </nav>

                {/* Guide sidebar */}
                <GuideSidebar
                    guide={guide}
                    currentSectionSlug={params.section}
                    currentIndex={currentIndex}
                    headings={headings}
                />

                <article className="prose max-w-none">
                    <header className="mb-8 not-prose">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">
                            {metadata?.title}
                        </h1>
                        {metadata?.description && (
                            <p className="text-muted-foreground">
                                {metadata.description}
                            </p>
                        )}
                    </header>
                    <MdxContentWrapper dictionaryEntries={dictionaryEntries}>
                        {content}
                    </MdxContentWrapper>
                </article>

                {/* Navigation */}
                <nav className="mt-12 pt-8 border-t border-border">
                    <div className="flex justify-between items-center gap-4">
                        {prevSection ? (
                            <Link
                                href={prevSection.route}
                                className="flex flex-col items-start text-left hover:opacity-80 transition-opacity"
                            >
                                <span className="text-sm text-muted-foreground">前のセクション</span>
                                <span className="font-medium">{prevSection.frontMatter?.title || prevSection.title}</span>
                            </Link>
                        ) : (
                            <div />
                        )}

                        {nextSection ? (
                            <Link
                                href={nextSection.route}
                                className="flex flex-col items-end text-right hover:opacity-80 transition-opacity"
                            >
                                <span className="text-sm text-muted-foreground">次のセクション</span>
                                <span className="font-medium">{nextSection.frontMatter?.title || nextSection.title}</span>
                            </Link>
                        ) : (
                            <Link
                                href={guide.route}
                                className="flex flex-col items-end text-right hover:opacity-80 transition-opacity"
                            >
                                <span className="text-sm text-muted-foreground">完了</span>
                                <span className="font-medium">ガイド一覧に戻る</span>
                            </Link>
                        )}
                    </div>
                </nav>
            </div>
        </ArticleLayout>
    )
}
