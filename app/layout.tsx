import type { Metadata } from "next";
import "nextra-theme-blog/style.css";
import { NextraTheme } from './_components/nextra-theme'
import type { FC, ReactNode } from 'react'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'

export const metadata: Metadata = {
  title: "技術ブログ",
  description: "技術系ブログ",
};

const RootLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  const pageMap = await getPageMap()
  return (
    <html lang="ja" dir="ltr">
      <Head faviconGlyph="✦" />
      <body style={{ margin: 0 }}>
        <NextraTheme pageMap={pageMap}>{children}</NextraTheme>
      </body>
    </html>
  )
}

export default RootLayout