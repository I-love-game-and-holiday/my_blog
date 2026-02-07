import { Metadata } from 'next'
import { CONTENT_MAX_WIDTH } from '@/lib/constants'

export const metadata: Metadata = {
    title: 'About',
    description:
        'tanaka101について - Progateの次のステップを支える学習サイト',
}

export default function AboutPage() {
    return (
        <div className="container py-16 md:py-24">
            <div className={`${CONTENT_MAX_WIDTH} mx-auto`}>
                <h1 className="text-3xl font-bold mb-8">About</h1>

                <section className="space-y-6 text-muted-foreground leading-relaxed">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-3">
                            このサイトについて
                        </h2>
                        <p>
                            tanaka101は、Progateのようなプログラミング学習サイトを終えた方が自力でアプリを作れるようになるための学習サイトです。
                        </p>
                        <p className="mt-2">
                            ステップバイステップのハンズオン形式で、実践的なスキルを身につけられるコンテンツを提供していきます。
                            ブログは雑多な記事を気まぐれで書く予定です。
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-3">
                            運営者について
                        </h2>
                        <p>
                            フリーランスのフルスタックエンジニアとして活動しています。
                            法人の戸籍管理システムの開発をプライムとして一人で担当し、要件定義からフロントエンド・バックエンド・データベース・クラウドインフラまで一通り経験しました。
                        </p>
                        <p className="mt-2">
                            まだまだひよっこですが、その分つまずきやすいポイントが分かるので、それをコンテンツに活かしています。
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-3">
                            サイトを作った理由
                        </h2>
                        <p>
                            母が「ホームページを作れるようになりたい」と言ったのがきっかけです。
                            とりあえずProgateを進めたものの、その先に何をすればいいか分からない
                            ── そんな人が迷わず次のステップに進めるサイトを作りたいと思いました。
                        </p>
                        <p className="mt-2">
                            ITの知識がゼロでも、Progateさえ終えていれば自分の力でアプリが作れるようになる。
                            そんな場所を目指しています。
                        </p>
                    </div>
                </section>
            </div>
        </div>
    )
}
