import { getPosts } from '@/lib/get-posts'
import { ClickableCard } from '@/components/ui/clickable-card'

export const metadata = {
    title: 'Blog',
    description: '技術メモ、IT以外の雑多な内容も書いていきます。',
}

export default async function BlogPage() {
    const posts = await getPosts()

    return (
        <div className="container py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Blog</h1>
                <p className="text-muted-foreground">
                    技術メモ、IT以外の雑多な内容も書いていきます。
                </p>
            </div>

            {posts.length === 0 ? (
                <p className="text-muted-foreground">まだ記事がありません。</p>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <ClickableCard
                            key={post.route}
                            href={post.route}
                            padding="none"
                            className="flex flex-col gap-1 p-5"
                        >
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
                        </ClickableCard>
                    ))}
                </div>
            )}
        </div>
    )
}
