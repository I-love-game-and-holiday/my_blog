# globals.css 基盤整理 + レスポンシブ準備 改修計画

## 方針決定事項

- 未使用dictionary-panel系CSS（約90行）→ **全削除**
- @tailwindcss/typography → **導入しない**（独自実装維持 + clamp()追加）
- z-index → **ヘッダーを上位にする**（header: 60, panel: 50, overlay: 50）

---

## Phase 0: デッドコード削除

### 対象ファイル
- `src/styles/globals.css`

### 作業内容
globals.cssから以下の未使用CSSを削除（どのTSXからもclassNameで参照されていない）:

| 行範囲 | クラス名 | 理由 |
|--------|---------|------|
| L154-157 | `.article-layout` | TSXコンポーネント名であり、CSSクラスとして未使用 |
| L159-161 | `.article-content` | 同上 |
| L163-170 | `.dictionary-panel`, `.dictionary-panel-open` | SlidePanel/MobileBottomSheetに移行済み |
| L172-182 | `@media` 2ブロック（dictionary-panel用） | 同上 |
| L184-190 | `.dictionary-panel-content`, `.dictionary-panel-placeholder` | 同上 |
| L212-241 | `.dictionary-panel .prose` 系オーバーライド7つ | 同上 |

**残すもの**: `.dictionary-term`, `.dictionary-term:hover`, `.dictionary-term-active`（dictionary-term.tsxで使用中）

### 検証
- `npm run build` 成功
- `/blog/[slug]` で辞書用語クリック → SlidePanel正常動作
- `/learn/[course]/[lesson]` で辞書 + ContentSidebar正常
- dictionary-termのdotted underline、hover、active状態が維持

---

## Phase 1: デザイントークン層の構築

### 対象ファイル
- `src/styles/globals.css`
- `src/lib/constants.ts`
- `src/components/layout/slide-panel.tsx`
- `src/components/layout/site-header.tsx`

### 1-A: @theme inline の拡張

```css
@theme inline {
    /* 既存のradius, color はそのまま */

    /* Layout */
    --header-height: 3.5rem;
    --container-max-width: 56rem;
    --content-max-width: 42rem;

    /* Z-index scale（ヘッダーを最上位に） */
    --z-base: 10;
    --z-panel-trigger: 40;
    --z-panel: 50;
    --z-overlay: 50;
    --z-header: 60;

    /* Code block colors */
    --color-code-bg: #1a1a1a;
    --color-code-fg: #e5e5e5;
    --color-code-highlight: #6366f1;
}
```

### 1-B: prose-accent のテーマカラー化

`:root` と `.dark` に追加:
```css
:root {
    --prose-accent: #3b82f6;       /* blue-500相当 */
    --prose-accent-light: #60a5fa; /* blue-400相当 */
}
.dark {
    --prose-accent: #60a5fa;
    --prose-accent-light: #93c5fd;
}
```

### 1-C: ハードコード色の置換（globals.css内）

| 変更前 | 変更後 | 箇所 |
|--------|--------|------|
| `border-blue-500` | `border-[var(--prose-accent)]` | .prose h1 |
| `bg-blue-400` | `bg-[var(--prose-accent-light)]` | .prose h3::before |
| `bg-[#1a1a1a]` | `bg-[var(--color-code-bg)]` | .prose pre, .code-block-dark |
| `text-[#e5e5e5]` | `text-[var(--color-code-fg)]` | .prose pre |
| `#6366f1`（2箇所） | `var(--color-code-highlight)` | コードハイライト L143-144 |

### 1-D: HEADER_HEIGHTのCSS変数化

**slide-panel.tsx**:
- `style={{ top: HEADER_HEIGHT }}` (3箇所) → `style={{ top: 'var(--header-height)' }}`
- `h-[calc(100%-56px)]` (2箇所) → `h-[calc(100%-var(--header-height))]`
- `HEADER_HEIGHT` のimport削除

**site-header.tsx**:
- `h-14` → `h-(--header-height)` （Tailwind v4のCSS変数shorthand）

### 1-E: constants.ts の整理

- `CONTAINER_MAX_WIDTH` → **削除**（どのTSXからもimportなし）
- `HEADER_HEIGHT` → **残す** + CSS変数との対応コメント追加
- `CONTENT_MAX_WIDTH` → **残す**（3ファイルで使用中）
- その他（INTERACTIVE_*, COMPLETED_*）→ **変更なし**

### 検証
- `npm run build` 成功
- ヘッダー高さ56px維持
- SlidePanel top位置・高さ正常
- .prose h1 左ボーダー色、h3ドット色が維持
- pre背景色維持
- コードハイライト色維持

---

## Phase 2: .container レスポンシブ + z-index適用

### 対象ファイル
- `src/styles/globals.css`
- `src/components/layout/site-header.tsx`
- `src/components/layout/slide-panel.tsx`
- `src/components/layout/mobile-bottom-sheet.tsx`
- `src/components/code/copyable-code.tsx`

### 2-A: .container のレスポンシブpadding

```css
/* Before */
.container {
    @apply max-w-4xl mx-auto px-4 sm:px-6;
}

/* After */
.container {
    max-width: var(--container-max-width);
    @apply mx-auto px-4 sm:px-6 lg:px-8;
}
```

### 2-B: z-indexのCSS変数適用

| ファイル | 現在 | 変更後 |
|---------|------|--------|
| site-header.tsx | `z-50` | `z-(--z-header)` |
| slide-panel.tsx L59 | `z-40` | `z-(--z-panel-trigger)` |
| slide-panel.tsx L69 | `z-40` | `z-(--z-panel-trigger)` |
| slide-panel.tsx L81 | `z-50` | `z-(--z-panel)` |
| mobile-bottom-sheet.tsx | `z-50` | `z-(--z-overlay)` |
| copyable-code.tsx | `z-10` | `z-(--z-base)` |

### 検証
- `npm run build` 成功
- ヘッダー(z-60)がパネル(z-50)の上に表示されること
- モバイルbottom-sheetがコンテンツの上に表示されること
- デスクトップ(>=1024px)でcontainer左右余白32pxに増加
- モバイル(<640px)でpadding-x 16px維持

---

## Phase 3: .prose のレスポンシブ対応（clamp導入）

### 対象ファイル
- `src/styles/globals.css`
- `src/app/blog/[slug]/page.tsx`
- `src/app/learn/[course]/[lesson]/page.tsx`
- `src/app/dictionary/[slug]/page.tsx`
- `src/app/guides/[guide]/[section]/page.tsx`

### 3-A: .prose 見出しにclamp()導入

| 要素 | Before | After (clamp) | モバイル | デスクトップ |
|------|--------|---------------|---------|------------|
| h1 | `text-3xl` (30px) | `clamp(1.5rem, 1.25rem + 1vw, 1.875rem)` | 24px | 30px |
| h2 | `text-2xl` (24px) | `clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)` | 20px | 24px |
| h3 | `text-xl` (20px) | `clamp(1.125rem, 1rem + 0.5vw, 1.25rem)` | 18px | 20px |

`@apply text-3xl` → `font-size: clamp(...)` に変更する際、`text-3xl` が持つ `line-height` も失われるため、明示的に `line-height: 1.3` を設定する。

### 3-B: 記事ページのnot-prose内h1の対応

4ファイルの共通パターン `<h1 className="text-3xl font-bold tracking-tight mb-2">` を `text-2xl md:text-3xl` に変更。

### 検証
- `npm run build` 成功
- DevToolsレスポンシブモード:
  - 320px幅: h1=24px, h2=20px, h3=18px
  - 768px幅: 中間値
  - 1024px+: h1=30px, h2=24px, h3=20px（現在と同一）
- line-heightの崩れがないこと
- not-proseヘッダーのh1がモバイルで縮小されること

---

## Phase 4: .prose-sm の明示的定義

### 対象ファイル
- `src/styles/globals.css`

### 作業内容

Phase 0で削除した `.dictionary-panel .prose` の内容を、汎用的な `.prose-sm` として再定義。
現在 `prose-sm` は dictionary-sidebar.tsx, callout.tsx, learn-more.tsx で参照されているが、@tailwindcss/typography未導入のため実質無効。これを動作するようにする。

```css
.prose-sm {
    @apply text-sm;
}
.prose-sm p {
    @apply leading-6 mb-3;
}
.prose-sm h2 {
    @apply text-base font-semibold mt-4 mb-2;
}
.prose-sm h3 {
    @apply text-sm font-semibold mt-3 mb-1;
}
.prose-sm pre {
    @apply text-xs p-2;
}
.prose-sm code {
    @apply text-xs;
}
.prose-sm ul, .prose-sm ol {
    @apply my-2 pl-4;
}
.prose-sm li {
    @apply mb-1;
}
```

### 検証
- dictionary-sidebar.tsx スライドパネル内テキストサイズが以前と同等
- callout.tsx のテキストが適切なサイズ
- learn-more.tsx の展開コンテンツが適切

---

## フェーズ依存関係

```
Phase 0 (デッドコード削除)
    │
    v
Phase 1 (デザイントークン層)
    │
    ├── Phase 2 (container + z-index)
    ├── Phase 3 (prose clamp)
    └── Phase 4 (prose-sm)
```

Phase 2, 3, 4 は互いに独立。全てPhase 1に依存。

---

## 改修後のglobals.css構造（予想）

```
L1-4:       @import, @custom-variant
L6-45:      @theme inline（拡張済み: layout, z-index, code colors）
L47-88:     :root / .dark（prose-accent追加）
L90-98:     @layer base
L100-155:   .prose（clamp導入済み）
L157-175:   .prose-sm（新規）
L177-184:   コードハイライト（CSS変数化済み）
L186-189:   .container（レスポンシブpadding）
L191-207:   .dictionary-term系（変更なし）
L209-213:   .figure-caption
L215-260:   .content-table / .code-block（CSS変数化済み）
```

約260行（現在296行から約35行削減 + 構造明確化）

---

## Phase 5: SiteHeader モバイルナビゲーション

### 対象: `src/components/layout/site-header.tsx`
- md: (768px)をブレークポイント。ハンバーガーメニュー + ドロップダウン
- ThemeToggleはモバイルでも常時表示

## Phase 6: 一覧ページのグリッドレスポンシブ化

### 対象: `src/app/learn/page.tsx`, `src/app/guides/page.tsx`
- `grid gap-6` → `grid gap-6 sm:grid-cols-2`
- blog/page.tsxは変更しない（時系列リストは単一列が適切）

## Phase 7: レッスン/ガイドナビゲーションの小画面対応

### 対象: `src/components/content/lesson-navigation.tsx`, `src/app/guides/[guide]/[section]/page.tsx`
- `flex justify-between` → `flex flex-col-reverse gap-3 sm:flex-row sm:justify-between sm:items-center`

## Phase 8: @container インフラ整備

### 対象: `src/styles/globals.css`
- `.container-query { container-type: inline-size; }` 追加

## Phase 9: ホームページ微調整

### 対象: `src/app/page.tsx`
- `p-8 md:p-10` → `p-6 sm:p-8 md:p-10`

---

## 将来課題（スコープ外）

- **constants.tsのINTERACTIVE_*定数** — @applyベースユーティリティへの移行検討
- **他コンポーネントのハードコード色** — callout.tsx, box-diagram.tsx, alert.tsx等のblue/green/red
- **@container の実コンポーネント適用** — push-layout sidebar導入時
