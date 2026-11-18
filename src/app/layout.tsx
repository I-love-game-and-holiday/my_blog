import { Head } from 'nextra/components'
import { Analytics } from "@vercel/analytics/next"
import '@/styles/globals.css'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { CourseProgressProvider } from '@/contexts/course-progress-context'
import { CONTENT_SIDEBAR_INIT_SCRIPT } from '@/lib/content-sidebar-state'
import { Metadata } from 'next'
import { Inter, Nunito } from 'next/font/google'

export const metadata: Metadata = {
    title: {
        default: 'tanaka101',
        template: '%s | tanaka101',
    },
    description: 'プロゲートを終えた非エンジニア向け。実践的なハンズオンで次のステップへ。',
    other: {
        'google-adsense-account': 'ca-pub-6394268468794969',
    },
}

/** スキップリンクの移動先になる <main> のid */
const MAIN_CONTENT_ID = 'main-content'

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
})

const nunito = Nunito({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-nunito',
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ja" className={`${inter.className} ${nunito.variable}`} suppressHydrationWarning>
            <Head backgroundColor={{ dark: '#171717', light: '#ffffff' }} />
            <body className="min-h-screen flex flex-col">
                <script dangerouslySetInnerHTML={{ __html: CONTENT_SIDEBAR_INIT_SCRIPT }} />
                <ThemeProvider>
                    <CourseProgressProvider>
                        {/* キーボード利用者向け。Tabキーで最初にフォーカスされたときだけ表示する */}
                        <a
                            href={`#${MAIN_CONTENT_ID}`}
                            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-(--z-skip-link) focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:ring-2 focus:ring-foreground"
                        >
                            本文へ移動
                        </a>
                        <SiteHeader />
                        {/* tabIndex={-1}: スキップリンクで移動したとき、main自体にフォーカスを移すため */}
                        <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1 outline-none">
                            {children}
                        </main>
                        <SiteFooter />
                    </CourseProgressProvider>
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    )
}
