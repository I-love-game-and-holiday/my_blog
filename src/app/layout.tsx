import { Head } from 'nextra/components'
import '@/styles/globals.css'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { DictionaryProvider } from '@/contexts/dictionary-context'
import { Metadata } from 'next'
import { Inter, Nunito } from 'next/font/google'

export const metadata: Metadata = {
    title: {
        default: 'tanaka101',
        template: '%s | tanaka101',
    },
    description: 'プロゲートを終えた非エンジニア向け。実践的なハンズオンで次のステップへ。',
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
        <html lang="ja" className={`${inter.className} ${nunito.variable}`}>
            <Head backgroundColor={{ dark: '#171717', light: '#ffffff' }} />
            <body className="min-h-screen flex flex-col">
                <DictionaryProvider>
                    <SiteHeader />
                    <main className="flex-1">
                        {children}
                    </main>
                    <SiteFooter />
                </DictionaryProvider>
            </body>
        </html>
    )
}
