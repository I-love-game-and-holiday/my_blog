import { getPostSlugs, getPosts } from '@/lib/get-posts'
import { getPostContent } from '@/lib/mdx'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildPageMetadata } from '@/lib/seo'
import { JsonLd } from '@/components/seo/json-ld'
import { BlogToc } from '@/components/content/blog-toc'
import { Breadcrumb } from '@/components/layout/breadcrumb'

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
    if (!post) return {}

    return buildPageMetadata({
        title: post.frontMatter.title,
        description: post.frontMatter.description,
        path: post.route,
        type: 'article',
        publishedTime: post.frontMatter.date,
        tags: post.frontMatter.tags,
    })
}

export default async function BlogPostPage(props: PageProps) {
    const params = await props.params
    const result = await getPostContent(params.slug)

    if (!result) {
        notFound()
    }

    const { metadata, content, headings } = result

    const postPath = `/blog/${params.slug}`
    const breadcrumbItems = [
        { label: 'Blog', href: '/blog' },
        { label: metadata?.title },
    ]

    return (
        <div className="container py-12">
            {/* 構造化データ（検索結果のパンくず・記事情報） */}
            <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems.map(item => ({ label: item.label, path: item.href })), postPath)} />
            <JsonLd data={buildArticleJsonLd({ title: metadata?.title, description: metadata?.description, path: postPath, datePublished: metadata?.date })} />

            <Breadcrumb items={breadcrumbItems} />

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
                <BlogToc headings={headings} />
                {content}
            </article>
        </div>
    )
}
