import { Metadata } from 'next'
import { CONTENT_MAX_WIDTH } from '@/lib/constants'

export const metadata: Metadata = {
    title: 'プライバシーポリシー',
    description: 'tanaka101のプライバシーポリシー',
}

export default function PrivacyPage() {
    return (
        <div className="container py-section-static">
            <div className={`${CONTENT_MAX_WIDTH} mx-auto`}>
                <h1 className="text-3xl font-bold mb-8">
                    プライバシーポリシー
                </h1>

                <div className="space-y-8 text-muted-foreground leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">
                            広告について
                        </h2>
                        <p>
                            当サイトでは、第三者配信の広告サービス（Google
                            AdSense）を利用しています。
                        </p>
                        <p className="mt-2">
                            広告配信事業者は、ユーザーの興味に応じた広告を表示するために
                            Cookie
                            を使用することがあります。Cookieを無効にする設定やGoogleアドセンスに関する詳細は、
                            <a
                                href="https://policies.google.com/technologies/ads?hl=ja"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                            >
                                広告 – ポリシーと規約 – Google
                            </a>
                            をご確認ください。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">
                            アクセス解析ツールについて
                        </h2>
                        <p>
                            当サイトでは、Vercel
                            が提供するアクセス解析ツール「Vercel
                            Analytics」を利用しています。Vercel Analytics
                            は Cookie
                            を使用せず、個人を特定できない匿名のアクセスデータのみを収集しています。
                        </p>
                        <p className="mt-2">
                            詳しくは
                            <a
                                href="https://vercel.com/docs/analytics/privacy-policy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                            >
                                Vercel Analytics Privacy Policy
                            </a>
                            をご確認ください。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">
                            免責事項
                        </h2>
                        <p>
                            当サイトに掲載されている情報の正確性には万全を期していますが、その内容について保証するものではありません。当サイトの情報を利用することで生じた損害について、一切の責任を負いかねます。
                        </p>
                        <p className="mt-2">
                            また、当サイトからリンクやバナーなどで移動した先のサイトで提供される情報やサービスについても、責任を負いかねますのでご了承ください。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">
                            著作権について
                        </h2>
                        <p>
                            当サイトに掲載されている文章・画像・コードなどのコンテンツの著作権は、運営者に帰属します。無断転載はご遠慮ください。引用する際は、出典元として当サイトへのリンクを掲載してください。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-3">
                            プライバシーポリシーの変更について
                        </h2>
                        <p>
                            当サイトは、必要に応じて本プライバシーポリシーの内容を変更することがあります。変更後のプライバシーポリシーは、当ページに掲載した時点で効力を生じるものとします。
                        </p>
                    </section>

                    <p className="text-sm text-muted-foreground pt-4 border-t border-border">
                        制定日: 2025年2月10日
                    </p>
                </div>
            </div>
        </div>
    )
}
