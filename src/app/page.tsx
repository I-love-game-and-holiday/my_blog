import Link from 'next/link'
import type { Metadata } from 'next'
import { CONTENT_MAX_WIDTH, SITE_DESCRIPTION, SITE_NAME } from '@/lib/constants'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = {
    ...buildPageMetadata({
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        path: '/',
    }),
    // ホームはタイトルの template（「| tanaka101」）を付けない
    title: { absolute: SITE_NAME },
}

export default function HomePage() {
    return (
        <div className="container py-section-hero">
            {/* ヒーローセクション */}
            <section className="text-center mb-16">
                <p className={`text-page-subtitle text-muted-foreground ${CONTENT_MAX_WIDTH} mx-auto`}>
                    基礎を学んだあなたが、<br className="md:hidden" />
                    自分でアプリを作るまで。
                </p>
            </section>

            {/* メインの導線: Learn */}
            <section className={`${CONTENT_MAX_WIDTH} mx-auto mb-6`}>
                <Link
                    href="/learn"
                    className="group block p-card-cta bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
                >
                    <div className="mb-4">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-background/20 rounded">
                            Learn
                        </span>
                    </div>
                    <h2 className="text-page-title font-semibold mb-3 group-hover:underline">
                        学習コース
                    </h2>
                    <p className="text-background/80">
                        ハンズオンで基礎を身に着ける
                    </p>
                </Link>
            </section>

            {/* サブの導線: Blog */}
            <section className={`${CONTENT_MAX_WIDTH} mx-auto`}>
                <Link
                    href="/blog"
                    className="group block p-6 border border-border rounded-lg hover:border-foreground/20 transition-colors"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs text-muted-foreground">Blog</span>
                            <h3 className="font-medium group-hover:underline">
                                雑記ブログ
                            </h3>
                        </div>
                        <span className="text-muted-foreground text-sm">→</span>
                    </div>
                </Link>
            </section>
        </div>
    )
}
