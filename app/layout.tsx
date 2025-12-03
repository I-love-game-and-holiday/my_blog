import type { Metadata } from "next";
import "nextra-theme-blog/style.css";

export const metadata: Metadata = {
  title: "技術ブログ",
  description: "技術系ブログ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
