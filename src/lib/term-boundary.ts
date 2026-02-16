const KATAKANA_RANGE = /[\u30A0-\u30FF]/
const ENGLISH_BOUNDARY = /[\s,.!?;:'"()\[\]{}]/

/**
 * カタカナのみで構成された用語かどうか（長音符「ー」含む）
 */
function isKatakanaOnly(term: string): boolean {
    return /^[\u30A0-\u30FF\u30FC]+$/.test(term)
}

/**
 * マッチ位置が有効なワードバウンダリ上にあるかを判定する
 * - 英語: 前後が空白/句読点/テキスト境界
 * - カタカナ語: 前後にカタカナが続かない
 * - その他の日本語（漢字・ひらがな混在）: バウンダリチェックなし（常にマッチ）
 */
export function isValidTermBoundary(
    text: string,
    matchIndex: number,
    termLength: number,
    term: string
): boolean {
    const beforeChar = text[matchIndex - 1]
    const afterChar = text[matchIndex + termLength]

    const isJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(term)

    if (!isJapanese) {
        // 英語: 従来のワードバウンダリ
        const boundaryBefore = !beforeChar || ENGLISH_BOUNDARY.test(beforeChar)
        const boundaryAfter = !afterChar || ENGLISH_BOUNDARY.test(afterChar)
        return boundaryBefore && boundaryAfter
    }

    if (isKatakanaOnly(term)) {
        // カタカナ語: 前後にカタカナが続く場合は不正マッチ
        const kataBefore = beforeChar ? KATAKANA_RANGE.test(beforeChar) : false
        const kataAfter = afterChar ? KATAKANA_RANGE.test(afterChar) : false
        return !kataBefore && !kataAfter
    }

    // 漢字・ひらがな混在: 従来通りバウンダリチェックなし
    return true
}
