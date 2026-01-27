import Link from 'next/link'
import { CONTENT_MAX_WIDTH } from '@/lib/constants'
import { ClickableCard } from '@/components/ui/clickable-card'

export default function HomePage() {
    return (
        <div className="container py-16 md:py-24">
            {/* Hero Section */}
            <section className="text-center mb-16">
                <p className={`text-lg md:text-xl text-muted-foreground ${CONTENT_MAX_WIDTH} mx-auto`}>
                Progateを終えたあなたが、
                自分でアプリを作れるようになるまで。
                </p>
            </section>

            {/* Main CTA - Learn */}
            <section className={`${CONTENT_MAX_WIDTH} mx-auto mb-8`}>
                <Link
                    href="/learn"
                    className="group block p-8 md:p-10 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
                >
                    <div className="mb-4">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-background/20 rounded">
                            Learn
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-semibold mb-3 group-hover:underline">
                        学習コースを始める
                    </h2>
                    <p className="text-background/80">
                        ステップバイステップで実践スキルを身につける。
                        プロゲートの次に進むためのハンズオン教材。
                    </p>
                </Link>
            </section>

            {/* Secondary - Blog */}
            <section className={`${CONTENT_MAX_WIDTH} mx-auto`}>
                <ClickableCard href="/blog" padding="none" className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs text-muted-foreground">Blog</span>
                            <h3 className="font-medium group-hover:underline">
                                技術ブログ
                            </h3>
                        </div>
                        <span className="text-muted-foreground text-sm">→</span>
                    </div>
                </ClickableCard>
            </section>
        </div>
    )
}
