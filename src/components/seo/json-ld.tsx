type JsonLdProps = {
    /** 構造化データ（schema.org の形のオブジェクト）。lib/seo.ts の build*JsonLd で作る */
    data: Record<string, unknown>
}

/**
 * 構造化データ（JSON-LD）を <script type="application/ld+json"> として出力する
 *
 * 記事タイトルなどに「</script>」が含まれてもタグが閉じないよう、`<` をエスケープする。
 */
export function JsonLd({ data }: JsonLdProps) {
    const json = JSON.stringify(data).replace(/</g, '\\u003c')

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: json }}
        />
    )
}
