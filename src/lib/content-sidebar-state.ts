/** サイドバー開閉状態を保存するLocalStorageキー（値は 'true' | 'false'） */
export const CONTENT_SIDEBAR_STORAGE_KEY = 'tanaka101_content_sidebar_open'

/** 閉じている間だけ <html> に付与するdata属性（値は 'closed'）。globals.css のスタイルと対応 */
export const CONTENT_SIDEBAR_ATTRIBUTE = 'data-content-sidebar'

/**
 * hydration前に実行するインラインスクリプト
 *
 * ページは静的生成されるためサーバーはユーザーの設定を知れない。
 * そこで描画前にLocalStorageを読んで <html> に属性を付け、CSSで初回描画から閉じた状態にする。
 */
export const CONTENT_SIDEBAR_INIT_SCRIPT = `try{if(localStorage.getItem('${CONTENT_SIDEBAR_STORAGE_KEY}')==='false')document.documentElement.setAttribute('${CONTENT_SIDEBAR_ATTRIBUTE}','closed')}catch(e){}`
