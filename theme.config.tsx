import { BlogThemeConfig } from 'nextra-theme-blog'

const config: BlogThemeConfig = {
  footer: <p>MIT 2025 © Your Name.</p>,
  head: ({ title, meta }) => (
    <>
      {meta.description && <meta name="description" content={meta.description} />}
      {meta.tag && <meta name="keywords" content={meta.tag} />}
      {meta.author && <meta name="author" content={meta.author} />}
    </>
  ),
  readMore: '続きを読む →',
  titleSuffix: ' | 技術ブログ',
  postFooter: null,
  darkMode: true,
  navs: [
    {
      url: 'https://github.com',
      name: 'GitHub',
    },
  ],
}

export default config

