// デフォルトの著者名（個人開発のため一括管理）
const AUTHOR = 'ウツ抜けエンジニア田中'

const config = {
  footer: <p>MIT 2025 © {AUTHOR}.</p>,
  head: ({ meta }: { title?: string; meta?: Record<string, string> }) => (
    <>
      {meta?.description && <meta name="description" content={meta.description} />}
      {meta?.tag && <meta name="keywords" content={meta.tag} />}
      <meta name="author" content={meta?.author || AUTHOR} />
    </>
  ),
  readMore: '続きを読む →',
  titleSuffix: ' | 技術ブログ',
  postFooter: null,
  darkMode: true,
  navs: [
    {
      url: '/posts/db',
      name: 'データベース',
    },
    {
      url: '/posts/network',
      name: 'ネットワーク',
    },
    {
      url: '/posts/diary',
      name: '日記',
    },
    {
      url: 'https://github.com',
      name: 'GitHub',
    },
  ],
}

export default config

