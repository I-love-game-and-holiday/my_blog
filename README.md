# tanaka101

[![CI](https://github.com/I-love-game-and-holiday/my_blog/actions/workflows/ci.yml/badge.svg)](https://github.com/I-love-game-and-holiday/my_blog/actions/workflows/ci.yml)

Progate を終えた方がwebを学習できるサイト

フロントエンド領域の学習と継続的なアウトプットを目的に運用しています。

🌐 **Live**: [https://tanaka101.com](https://tanaka101.com)

## 主な機能

| 機能           | 説明                                                                         |
| -------------- | ---------------------------------------------------------------------------- |
| **Learn**      | ハンズオン形式の学習コース。進捗を localStorage に保存                       |
| **Guide**      | リファレンス形式のガイド                                                     |
| **Blog**       | 技術記事・備忘録                                                             |
| **Dictionary** | プログラミング用語集。コンテンツ内の用語を自動リンクし、モーダルで解説を表示 |
| **SEO**        | サイトマップ・RSS・OGP メタデータの自動生成                                  |

## 技術スタック

| カテゴリ               | 採用技術                            |
| ---------------------- | ----------------------------------- |
| フレームワーク         | Next.js 16 (App Router)             |
| 言語                   | TypeScript 5.9                      |
| UI                     | React 19, Tailwind CSS 4, shadcn/ui |
| コンテンツ             | MDX, Nextra 4, next-mdx-remote      |
| シンタックスハイライト | Shiki, rehype-pretty-code           |
| デプロイ               | Vercel                              |

## ディレクトリ構成

```
blog/
├── content/      MDX コンテンツ（blog / learn / guides / dictionary）
├── src/
│   ├── app/      Next.js App Router（sitemap, robots, rss を含む）
│   ├── components/
│   ├── contexts/ Context（進捗管理、用語モーダル）
│   ├── lib/      データ取得・MDX コンパイル・ハイライト
│   └── styles/
├── drafts/       構想段階のコンテンツ・設計メモ
└── CLAUDE.md     コーディング規約・設計原則の集約ドキュメント
```

## 開発

```bash
npm install
npm run dev      # 開発サーバー
npm run build    # 本番ビルド
```

## 運用メモ

- 設計原則・命名規約は [`CLAUDE.md`](./CLAUDE.md) に集約
- コンテンツ追加・機能変更は Pull Request ベース
- コンテンツの素案は `drafts/` で管理し、完成したら `content/` へ移動

## ライセンス

UNLICENSED
