import { getPosts } from '@/lib/get-posts'
import { ClickableCard } from '@/components/ui/clickable-card'

export const metadata = {
    title: 'Blog',
    description: '気になったことを気ままに書いてます。',
}

export default async function BlogPage() {
    const posts = await getPosts()

    return (
        <div className="container py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Blog</h1>
                <p className="text-muted-foreground">
                    気になったことを気ままに書いてます。
                </p>
            </div>

            {posts.length === 0 ? (
                <p className="text-muted-foreground">まだ記事がありません。</p>
            ) : (
                <div className="grid gap-6">
                    {posts.map((post) => (
                        <ClickableCard
                            key={post.route}
                            href={post.route}
                            padding="none"
                            className="p-6"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
                                <div>
                                    <h2 className="text-lg font-medium group-hover:underline">
                                        {post.frontMatter?.title || post.title}
                                    </h2>
                                    {post.frontMatter?.description && (
                                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                            {post.frontMatter.description}
                                        </p>
                                    )}
                                </div>
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
