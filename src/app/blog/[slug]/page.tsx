import Link from 'next/link'
import { getPostSlugs, getPosts } from '@/lib/get-posts'
import { getPostContent } from '@/lib/mdx'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BlogToc } from '@/components/content/blog-toc'

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

    const { metadata, content, headings } = result

    return (
        <div className="container py-12">
            <nav className="text-sm text-muted-foreground mb-6">
                <Link href="/blog" className="hover:text-foreground transition-colors">
                    Blog
                </Link>
                <span className="mx-2">/</span>
                <span className="text-foreground">
                    {metadata?.title}
                </span>
            </nav>

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
