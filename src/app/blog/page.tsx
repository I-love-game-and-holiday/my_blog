import Link from 'next/link'
import { getPosts } from '@/lib/get-posts'

export const metadata = {
    title: 'Blog',
    description: '技術メモ、検証記録、日々の学びを記録。',
}

export default async function BlogPage() {
    const posts = await getPosts()

    return (
        <div className="container py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Blog</h1>
                <p className="text-muted-foreground">
                    技術メモ、検証記録、日々の学びを記録。
                </p>
            </div>

            {posts.length === 0 ? (
                <p className="text-muted-foreground">まだ記事がありません。</p>
            ) : (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <article
                            key={post.route}
                            className="group"
                        >
                            <Link href={post.route} className="block">
                                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
                                    <h2 className="text-lg font-medium group-hover:underline">
                                        {post.frontMatter?.title || post.title}
                                    </h2>
                                    {post.frontMatter?.date && (
                                        <time className="text-sm text-muted-foreground shrink-0">
                                            {new Date(post.frontMatter.date).toLocaleDateString('ja-JP', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </time>
                                    )}
                                </div>
                                {post.frontMatter?.description && (
                                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                        {post.frontMatter.description}
                                    </p>
                                )}
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}
