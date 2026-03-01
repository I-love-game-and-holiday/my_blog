import Link from 'next/link'
import { CONTENT_MAX_WIDTH } from '@/lib/constants'

export default function HomePage() {
    return (
        <div className="container py-section-hero">
            {/* Hero Section */}
            <section className="text-center mb-16">
                <p className={`text-page-subtitle text-muted-foreground ${CONTENT_MAX_WIDTH} mx-auto`}>
                    基礎を学んだあなたが、<br className="md:hidden" />
                    自分でアプリを作るまで。
                </p>
            </section>

            {/* Main CTA - Learn */}
            <section className={`${CONTENT_MAX_WIDTH} mx-auto`}>
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
        </div>
    )
}
