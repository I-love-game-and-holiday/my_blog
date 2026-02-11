# CLAUDE.md

このファイルはプロジェクトの**唯一のドキュメント**である。設計方針・命名規約・コーディングガイドラインなど、プロジェクトに関するすべての規約をここに集約する。Claude Codeと開発者の双方がこのファイルを参照する。

> **分割の目安**: このファイルが800行を超えた場合、セクション単位での分離を検討すること。

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
| **SEO最適化** | 自動サイトマップ・RSS・メタデータ生成 |

---

## 技術スタック

| カテゴリ | 技術 |
|----------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript 5.9 |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| コンテンツ | MDX, Nextra 4, next-mdx-remote |
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
│   │   ├── mdx.ts       # MDXコンパイル
│   │   └── highlight.ts # コードハイライト（shiki）
│   └── styles/          # グローバルスタイル
├── public/              # 静的ファイル
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

## CSS設計（3レイヤーレスポンシブ）

コンポーネントに `md:text-xl` や `sm:p-8` のようなbreakpointを都度書かない。レスポンシブ対応は以下の3レイヤーで責務を分離する。

### Layer 1: レイアウト層（breakpoint許可）

**レイアウトの離散的な構造切替**のみbreakpointを使用する。表示/非表示、フロー方向、グリッド列数など、連続値で表現できない二値の判断が対象。

```tsx
// OK: 構造の切替（表示する/しない、縦/横）
<nav className="hidden md:flex">
<div className="flex flex-col-reverse sm:flex-row">
<div className="grid gap-6 sm:grid-cols-2">

// NG: サイズや余白の段階的変化
<div className="p-4 sm:p-6 md:p-8">
<h1 className="text-2xl md:text-3xl">
```

**使用場所**: レイアウトコンポーネント（`site-header.tsx`等）やページファイルのグリッド定義。

### Layer 2: コンテナ層（@container）

親のサイズに応じてコンポーネントが適応する。現在は未使用だが、サイドバー内ウィジェットなどコンテキスト依存のレイアウトに使う想定。

### Layer 3: デザイントークン層（breakpoint禁止）

`clamp()` を使い、ビューポート幅に応じて値が**滑らかに**変化する。コンポーネント側ではクラス名を1つ書くだけ。

定義場所: `src/styles/globals.css` の `Fluid Utilities (Layer 3)` セクション

#### 現在のトークン一覧

| クラス名 | 用途 | 範囲 |
|----------|------|------|
| `.text-page-title` | 記事タイトル、CTA見出し | 24px → 30px |
| `.text-page-subtitle` | ホームのサブテキスト | 18px → 20px |
| `.py-section-hero` | ヒーローセクション余白 | 64px → 96px |
| `.p-card-cta` | CTAカード内パディング | 32px → 40px |
| `.size-hero-icon` | ヒーローアイコン | 96px → 128px |

#### 新規トークン追加時のルール

1. `globals.css` の `Fluid Utilities (Layer 3)` セクションに追加する
2. 日本語コメントで **用途** と **px範囲** を明記する
3. クラス名は `{プロパティ}-{コンテキスト}` の形式にする（例: `text-page-title`, `p-card-cta`）
4. `clamp(最小値, 推奨値, 最大値)` で定義する

```css
/* 用途の説明 (最小px → 最大px) */
.text-section-heading {
    font-size: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
    line-height: 1.3;
}
```

### 判断基準

| 変化の性質 | レイヤー | 手法 |
|-----------|---------|------|
| 表示/非表示 | Layer 1 | `hidden md:block` |
| 縦並び/横並び | Layer 1 | `flex-col sm:flex-row` |
| 1列/2列 | Layer 1 | `sm:grid-cols-2` |
| フォントサイズ | Layer 3 | `clamp()` ユーティリティ |
| パディング・マージン | Layer 3 | `clamp()` ユーティリティ |
| 幅・高さ | Layer 3 | `clamp()` ユーティリティ |

**迷ったときの原則**: 「その値は0か1か（離散）、それとも連続的に変化するか？」 → 離散ならLayer 1、連続ならLayer 3。

---

## 注意事項

- コンテンツは `content/` 配下のMDXファイルで管理（DBは使用しない）
