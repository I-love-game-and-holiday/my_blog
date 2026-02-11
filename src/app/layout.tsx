import { Head } from 'nextra/components'
import { Analytics } from "@vercel/analytics/next"
import '@/styles/globals.css'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { ThemeProvider } from '@/components/theme-provider'
import { CourseProgressProvider } from '@/contexts/course-progress-context'
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
                <ThemeProvider>
                    <CourseProgressProvider>
                        <SiteHeader />
                        <main className="flex-1">
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
