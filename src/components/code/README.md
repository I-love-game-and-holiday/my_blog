# Code Components

コードブロック表示用の共通コンポーネント群。

## コンポーネント一覧

| コンポーネント | 用途 |
|--------------|------|
| `CopyableCode` | コピーボタン付きコードブロック（ヘッダーなし） |
| `CollapsibleCode` | 折りたたみ可能なコードブロック |
| `OsCodeBlock` | Mac/Windows切替のコードブロック |
| `OsCommandTabs` | Mac/Windows切替の複数コマンド表示 |
| `OsTable` | Mac/Windows切替のテーブル（`os/os-table.tsx`） |

## 使い方

### CopyableCode

コピーボタン付きのシンプルなコードブロック。ヘッダーや折りたたみ機能はなく、コードブロック右上にコピーボタンのみ表示。

```mdx
<CopyableCode>
```bash
npm install express
```
</CopyableCode>
```

| Props | 型 | デフォルト | 説明 |
|-------|-----|-----------|------|
| `children` | `ReactNode` | - | コードブロック（```で囲んだ部分） |

### CollapsibleCode

折りたたみ可能なコードブロック。長いコードを省スペースで表示したい場合に使用。

```mdx
<CollapsibleCode title="index.html" defaultOpen={false}>
```html
<!DOCTYPE html>
<html>
  ...
</html>
```
</CollapsibleCode>
```

| Props | 型 | デフォルト | 説明 |
|-------|-----|-----------|------|
| `title` | `string` | `"コード"` | ヘッダーに表示するタイトル |
| `defaultOpen` | `boolean` | `false` | 初期状態で開いているか |
| `children` | `ReactNode` | - | コードブロック（```で囲んだ部分） |

### OsCodeBlock

Mac/Windowsで異なるコマンドを表示する単一コードブロック。

```mdx
<OsCodeBlock
  title="Node.jsバージョン確認"
  mac="node -v"
  windows="node -v"
/>
```

| Props | 型 | デフォルト | 説明 |
|-------|-----|-----------|------|
| `mac` | `string` | - | Macで表示するコード |
| `windows` | `string` | - | Windowsで表示するコード |
| `title` | `string` | - | 右上に表示するタイトル（省略可） |

### OsCommandTabs

複数コマンドをまとめて表示する場合に使用。

```mdx
<OsCommandTabs
  commands={[
    { mac: "brew install node", windows: "winget install OpenJS.NodeJS", description: "インストール" },
    { mac: "node -v", windows: "node -v", description: "バージョン確認" },
  ]}
/>
```

| Props | 型 | 説明 |
|-------|-----|------|
| `commands` | `CommandItem[]` | コマンドの配列 |

```typescript
interface CommandItem {
  mac: string       // Macで表示するコマンド
  windows: string   // Windowsで表示するコマンド
  description?: string  // コマンドの説明（省略可）
}
```

## 内部構造

```
code/
├── index.ts              # エクスポート
├── copy-button.tsx       # コピーボタン（共通）
├── code-block-header.tsx # ヘッダー（共通）
├── code-block-wrapper.tsx # 外枠・コンテンツ（共通）
├── copyable-code.tsx     # コピーボタン付き（ヘッダーなし）
├── collapsible-code.tsx  # 折りたたみ
├── os-tabs.tsx           # OS切替タブ
└── os-code-block.tsx     # OS切替コードブロック
```

### 新しいコンポーネントを追加する場合

1. 共通部品を活用:
   - `CodeBlockWrapper`: 外枠（border, rounded）
   - `CodeBlockHeader`: ヘッダー（背景色、クリック可能オプション）
   - `CodeBlockContent`: コンテンツ部分（pre/codeのスタイル調整）
   - `CopyButton`: コピー機能

2. `index.ts`にエクスポートを追加

3. `src/lib/mdx.ts`の`mdxComponents`に登録

## スタイル

`globals.css`で以下のクラスを定義:

```css
.code-block-header {
  @apply border-b border-border bg-secondary;
}

.code-block-dark {
  @apply bg-[#1a1a1a];
}
```
