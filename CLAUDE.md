# CLAUDE.md

このファイルはClaude Codeがこのリポジトリで作業する際のガイダンスを提供します。

---

## プロジェクト概要

**tanaka101** - Progateを終えた方向けの学習サイト兼、個人の技術備忘録・ブログ

### コンセプト

- **対象者**: Progateを終えた非エンジニア向け
- **目的**: 実践的なハンズオンで次のステップへ導く学習プラットフォーム
- **特徴**: 技術記事（ブログ）とステップバイステップの学習コースを提供

### 主な機能

| 機能 | 説明 |
|------|------|
| **Learn** | ステップバイステップ学習コース（進捗表示付き） |
| **Blog** | 技術記事・備忘録 |
| **検索** | Pagefindによるオンサイト検索 |
| **自動ツイート** | Vercelデプロイ時にX(Twitter)へ自動投稿 |
| **SEO最適化** | 自動サイトマップ・RSS・メタデータ生成 |

---

## 技術スタック

| カテゴリ | 技術 |
|----------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript 5.9 |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| コンテンツ | MDX, Nextra 4, next-mdx-remote |
| 検索 | Pagefind |
| コメント | Giscus |
| アイコン | Lucide, Tabler Icons |
| デプロイ | Vercel |

---

## ディレクトリ構成

```
blog/
├── content/              # MDXコンテンツ
│   ├── blog/            # ブログ記事
│   └── learn/           # 学習コース
│       └── {course}/    # コースフォルダ
│           ├── _meta.ts # コースメタデータ
│           └── *.mdx    # レッスンファイル
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── blog/        # ブログページ
│   │   ├── learn/       # 学習ページ
│   │   ├── sitemap.ts   # サイトマップ生成
│   │   ├── robots.ts    # robots.txt生成
│   │   └── rss.xml/     # RSSフィード
│   ├── components/      # Reactコンポーネント
│   │   └── ui/          # shadcn/uiコンポーネント
│   ├── lib/             # ユーティリティ関数
│   │   ├── get-posts.ts # ブログ記事取得
│   │   ├── get-courses.ts # コース取得
│   │   └── mdx.ts       # MDXコンパイル
│   └── styles/          # グローバルスタイル
├── public/              # 静的ファイル
└── .github/
    ├── scripts/         # 自動化スクリプト
    └── workflows/       # GitHub Actions
```

---

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm run start

# 検索インデックス生成
npm run postbuild
```

---

## コンテンツ作成

### ブログ記事

`content/blog/` に MDX ファイルを作成:

```mdx
---
title: 記事タイトル
date: 2026-01-12
description: 記事の説明
tags:
  - タグ1
  - タグ2
---

記事本文...
```

### 学習コース

1. `content/learn/{course-slug}/` フォルダを作成
2. `_meta.ts` でコース情報を定義:
   ```typescript
   export default {
       title: 'コースタイトル',
       description: 'コースの説明',
       order: 1,
   }
   ```
3. `01-lesson-name.mdx` 形式でレッスンを追加:
   ```mdx
   ---
   title: レッスンタイトル
   order: 1
   description: レッスンの説明
   ---

   レッスン本文...
   ```

---

## 設計原則

### 基本方針

1. **可読性優先**: コードの短縮より、読みやすさ・理解しやすさを優先する
2. **保守性重視**: 将来の変更・拡張を容易にする設計を心がける
3. **シンプルさ**: 過度な抽象化を避け、必要十分な複雑さに留める

### DRY原則 (Don't Repeat Yourself)

- 同じロジックを複数箇所に書かない
- 重複コードは共通関数・コンポーネントに抽出する
- ただし、過度な共通化で可読性を損なわないこと
- 「3回以上繰り返したら抽出を検討する」を目安とする

### SOLID原則

| 原則 | 説明 | 適用例 |
|------|------|--------|
| **S** - 単一責任 | 1つのモジュール/クラスは1つの責任のみ持つ | コンポーネントは表示のみ、ロジックはhooksに分離 |
| **O** - 開放閉鎖 | 拡張に開き、修正に閉じる | 新しいコンテンツタイプを追加する際、既存コードを変更しない |
| **L** - リスコフ置換 | 派生型は基底型と置換可能 | 全コンポーネントは共通インターフェースを実装 |
| **I** - インターフェース分離 | クライアントが使わないメソッドに依存しない | コンポーネントごとに必要な機能のみ定義 |
| **D** - 依存性逆転 | 具象ではなく抽象に依存する | データ取得層はインターフェースを通じてアクセス |

---

## 命名規約

### TypeScript / React

[Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) に準拠する。

#### 識別子の命名

| 対象 | 規約 | 例 |
|------|------|-----|
| クラス | PascalCase | `PostManager` |
| 型・インターフェース | PascalCase | `PostItem`, `CourseItem` |
| 列挙型 | PascalCase | `ContentType` |
| 列挙型メンバー | PascalCase | `ContentType.Blog` |
| 関数 | camelCase | `handleClick` |
| 変数・プロパティ | camelCase | `postList`, `isVisible` |
| グローバル定数 | UPPER_SNAKE_CASE | `MAX_POSTS`, `DEFAULT_LIMIT` |
| 型パラメータ | 単一大文字 or PascalCase | `T`, `TProps` |

#### ファイル命名

| 対象 | 規約 | 例 |
|------|------|-----|
| Reactコンポーネント | kebab-case | `site-header.tsx` |
| hooks | camelCase (use接頭辞) | `useSearch.ts` |
| ユーティリティ | kebab-case | `get-posts.ts` |
| 型定義 | kebab-case | `types.ts` |

#### 禁止事項

- インターフェースに `I` プレフィックスを付けない: `IPost` → `Post`
- `_` プレフィックス/サフィックスを使用しない
- default exportを使用しない（named exportのみ）
- 曖昧な略語を使用しない: `btn` → `button`, `msg` → `message`

#### 略語の扱い

略語は1つの単語として扱い、先頭のみ大文字にする:
- `loadHttpUrl` (NOT `loadHTTPURL`)
- `xmlParser` (NOT `XMLParser`)
- 例外: `XMLHttpRequest` などプラットフォーム固有の名前

---

## コーディングガイドライン

### コンポーネント設計

```typescript
// 関数コンポーネント + named export
export function PostCard({ post, onSelect }: PostCardProps) {
  // hooksは先頭にまとめる
  const [isExpanded, setIsExpanded] = useState(false);

  // イベントハンドラ
  const handleClick = () => {
    setIsExpanded(!isExpanded);
    onSelect(post);
  };

  return (
    <article className="post-card">
      {/* JSX */}
    </article>
  );
}
```

### 型定義

```typescript
// 型は明示的に定義する
interface PostItem {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags?: string[];
}

// Union型で網羅性を保証
type ContentType = 'blog' | 'learn';
```

### Path Alias

`@/` プレフィックスで `src/` 配下を参照:

```typescript
import { getPosts } from '@/lib/get-posts';
import { SiteHeader } from '@/components/site-header';
```

---

## 注意事項

- コンテンツは `content/` 配下のMDXファイルで管理（DBは使用しない）
- ビルド後に `npm run postbuild` で検索インデックスを生成
- GitHub Secretsに Twitter API キーを設定することで自動ツイート機能が有効化
