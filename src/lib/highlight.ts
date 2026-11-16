import { codeToHtml } from 'shiki'
import { CODE_THEME } from '@/lib/constants'

/**
 * コード文字列を、色付けしたHTMLに変換する（OsCommandTabs で使用）
 * MDXのコードブロックは compile-mdx.ts の rehype-pretty-code が色付けするので、ここは通らない
 *
 * @param code 色付けするコード
 * @param lang 言語名（shiki の言語名。省略時は bash）
 */
export async function highlightCode(code: string, lang: string = 'bash'): Promise<string> {
    const html = await codeToHtml(code, {
        lang,
        theme: CODE_THEME,
    })
    return html
}
