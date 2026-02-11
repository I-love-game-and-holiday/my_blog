import { getPostSlugs, getPosts } from '@/lib/get-posts'
import { getPostContent } from '@/lib/mdx'
import { getDictionaryEntries, findDictionaryTermsInContent } from '@/lib/get-dictionary'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/layout/article-layout'
import { MdxContentWrapper } from '@/components/dictionary/mdx-components'
import { DictionarySidebar } from '@/components/layout/dictionary-sidebar'

type PageParams = {
    slug: string
}

type PageProps = {
    params: Promise<PageParams>
}

export async function generateStaticParams() {
    const slugs = getPostSlugs()
    return slugs.map(slug => ({ slug }))
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params
    const posts = await getPosts()
    const post = posts.find(p => p.slug === params.slug)

    return {
        title: post?.frontMatter?.title,
        description: post?.frontMatter?.description,
    }
}

export default async function BlogPostPage(props: PageProps) {
    const params = await props.params
    const result = await getPostContent(params.slug)

    if (!result) {
        notFound()
    }

    const { metadata, content, rawContent } = result
    const dictionaryEntries = await getDictionaryEntries()
    const pageTerms = findDictionaryTermsInContent(rawContent, dictionaryEntries)

    return (
        <ArticleLayout>
            <div className="container py-12">
                {/* Dictionary sidebar (right) */}
                <DictionarySidebar pageTerms={pageTerms} />

                <article className="prose max-w-none">
                    <header className="mb-8 not-prose">
                        <h1 className="text-page-title font-bold tracking-tight mb-2">
                            {metadata?.title}
                        </h1>
                        {metadata?.date && (
                            <time className="text-sm text-muted-foreground">
                                {new Date(metadata.date).toLocaleDateString('ja-JP', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </time>
                        )}
                        {metadata?.description && (
                            <p className="mt-2 text-muted-foreground">
                                {metadata.description}
                            </p>
                        )}
                    </header>
                    <MdxContentWrapper dictionaryEntries={dictionaryEntries}>
                        {content}
                    </MdxContentWrapper>
                </article>
            </div>
        </ArticleLayout>
    )
}
