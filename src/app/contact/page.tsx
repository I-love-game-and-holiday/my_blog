import { Metadata } from 'next'
import { CONTENT_MAX_WIDTH } from '@/lib/constants'

export const metadata: Metadata = {
    title: 'お問い合わせ',
    description: 'tanaka101へのお問い合わせはこちら',
}

export default function ContactPage() {
    return (
        <div className="container py-section-static">
            <div className={`${CONTENT_MAX_WIDTH} mx-auto`}>
                <h1 className="text-3xl font-bold mb-8">お問い合わせ</h1>

                <div className="space-y-6 text-muted-foreground leading-relaxed">
                    <p>
                        当サイトに関するご質問・ご要望・不具合の報告などがございましたら、以下のメールアドレスまでお気軽にご連絡ください。
                    </p>

                    <div className="rounded-lg border border-border p-6">
                        <p className="text-sm text-muted-foreground mb-1">
                            メールアドレス
                        </p>
                        <a
                            href="mailto:contact@tanaka101.com"
                            className="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                        >
                            contact@tanaka101.com
                        </a>
                    </div>

                    <p className="text-sm">
                        内容によっては返信にお時間をいただく場合や、返信を控えさせていただく場合がございます。あらかじめご了承ください。
                    </p>
                </div>
            </div>
        </div>
    )
}
