import { Head } from 'nextra/components'
import '@/styles/globals.css'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'

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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ja" className={inter.className}>
            <Head backgroundColor={{ dark: '#171717', light: '#ffffff' }} />
            <body className="min-h-screen flex flex-col">
                <SiteHeader />
                <main className="flex-1">
                    {children}
                </main>
                <SiteFooter />
            </body>
        </html>
    )
}
