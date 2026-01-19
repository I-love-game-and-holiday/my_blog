import { getDictionaryEntries } from '@/lib/get-dictionary'
import { DictionarySearch } from '@/components/dictionary-search'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: '用語辞典',
    description: 'プログラミング用語の解説一覧',
}

export default async function DictionaryPage() {
    const entries = await getDictionaryEntries()

    return (
        <div className="container py-12">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                    用語辞典
                </h1>
                <p className="text-muted-foreground">
                    プログラミング学習に役立つ用語の解説集です。記事内でハイライトされた用語をクリックすると、ここにある解説が表示されます。
                </p>
            </header>

            <DictionarySearch entries={entries} />
        </div>
    )
}
