/**
 * サイト全体の設定
 */

/**
 * サイトのURL（末尾スラッシュなし）。sitemap・robots・RSS で使う
 * 環境変数 NEXT_PUBLIC_SITE_URL がなければ本番URLにする
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tanaka101.com'

/** サイト名。タイトルの末尾・OGPの og:site_name・構造化データで使う */
export const SITE_NAME = 'tanaka101'

/** サイト全体の説明。ホームと、説明を持たないページの既定値に使う */
export const SITE_DESCRIPTION = 'プロゲートを終えた非エンジニア向け。実践的なハンズオンで次のステップへ。'

/**
 * コードハイライトのテーマ（shiki のテーマ名）
 * MDXのコードブロック（compile-mdx.ts）と OsCommandTabs（highlight.ts）の両方で使う
 */
export const CODE_THEME = 'github-dark'

/**
 * レイアウト関連の定数
 */

/** メインコンテンツの最大幅（Tailwind CSS クラス名） */
export const CONTENT_MAX_WIDTH = 'max-w-2xl'

/** ヘッダーの高さ（px）。CSS変数 --header-height (3.5rem) と同期 */
export const HEADER_HEIGHT = 56

/**
 * インタラクティブ要素のスタイル定数
 */

/** ホバー時の背景色（Tailwind CSS クラス名） */
export const INTERACTIVE_HOVER_BG = 'hover:bg-muted'

/** アクティブ（クリック）時の背景色（Tailwind CSS クラス名） */
export const INTERACTIVE_ACTIVE_BG = 'active:bg-muted-foreground/20'

/** インタラクティブ要素のトランジション（Tailwind CSS クラス名） */
export const INTERACTIVE_TRANSITION = 'transition-colors duration-150'

/**
 * 完了状態のスタイル定数
 */

/** 完了カードのボーダー色 */
export const COMPLETED_BORDER = 'border-success'

/** 完了チェックマーク（丸アイコン）の背景 */
export const COMPLETED_CIRCLE_BG = 'bg-success text-success-foreground'

/** 完了バッジのスタイル */
export const COMPLETED_BADGE_BG = 'bg-success/10 text-success'

/** 進捗バーの色 */
export const PROGRESS_BAR_BG = 'bg-success'
