import { getAllDictionaryContents } from '@/lib/get-dictionary'
import { ArticleLayoutClient } from './article-layout-client'
import { type ReactNode } from 'react'

type ArticleLayoutProps = {
    children: ReactNode
}

export async function ArticleLayout({ children }: ArticleLayoutProps) {
    const contentsMap = await getAllDictionaryContents()

    // Map を React で渡せる形式に変換
    const contents = Array.from(contentsMap.entries()).map(([slug, entry]) => ({
        slug,
        term: entry.term,
        aliases: entry.aliases,
        content: entry.content,
    }))

    return (
        <ArticleLayoutClient contents={contents}>
            {children}
        </ArticleLayoutClient>
    )
}
