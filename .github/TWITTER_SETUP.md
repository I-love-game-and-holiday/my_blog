# X (Twitter) API 自動ツイート設定ガイド

## 1. X Developer Portal での設定

### 必要な認証情報の取得

1. [X Developer Portal](https://developer.twitter.com/en/portal/dashboard)にアクセス

2. **Keys and tokens**タブを開く

3. 以下の 4 つの認証情報を取得:

#### Consumer Keys (API Keys)

- **API Key** (Consumer API Key)
- **API Key Secret** (Consumer API Secret)

これらが表示されていない場合は、**Regenerate**ボタンで再生成できます。

#### Authentication Tokens

- **Access Token**
- **Access Token Secret**

**Generate**ボタンを押して生成します。

⚠️ **重要**: これらの値は一度しか表示されないため、必ずメモ帳などに保存してください。

### 権限の確認

**User authentication settings**で以下を確認:

- **App permissions**: `Read and write` に設定されていること
- これにより、ツイートの投稿が可能になります

## 2. GitHub リポジトリでの設定

### GitHub Secrets の登録

1. GitHub リポジトリのページを開く
2. **Settings** → **Secrets and variables** → **Actions** に移動
3. **New repository secret**をクリック
4. 以下の 4 つの Secret を登録:

| Secret 名                     | 値                                                |
| ----------------------------- | ------------------------------------------------- |
| `TWITTER_API_KEY`             | X Developer Portal で取得した API Key             |
| `TWITTER_API_SECRET`          | X Developer Portal で取得した API Key Secret      |
| `TWITTER_ACCESS_TOKEN`        | X Developer Portal で取得した Access Token        |
| `TWITTER_ACCESS_TOKEN_SECRET` | X Developer Portal で取得した Access Token Secret |

## 3. 動作確認

### テスト方法

1. Vercel にデプロイを実行
2. デプロイが成功すると、GitHub Actions が自動的に実行されます
3. **Actions**タブで実行状況を確認できます

### トラブルシューティング

#### ツイートが投稿されない場合

1. **GitHub Actions のログを確認**

   - リポジトリの**Actions**タブを開く
   - 失敗したワークフローをクリック
   - エラーメッセージを確認

2. **よくあるエラー**

   - `401 Unauthorized`: 認証情報が間違っている
   - `403 Forbidden`: アプリの権限が不足している（Read and write に変更）
   - `429 Too Many Requests`: API 制限に達している（Free plan は 1 日 17 ツイートまで）

3. **環境変数の確認**
   - GitHub Secrets が正しく登録されているか確認
   - Secret 名にタイポがないか確認

## 4. カスタマイズ

### ツイート内容の変更

`.github/scripts/tweet.js`の以下の部分を編集:

```javascript
const tweetText = `新しい記事を公開しました！\n\n${deployUrl}`;
```

### 条件の変更

`.github/workflows/tweet-on-vercel-deploy.yml`の`if`条件を編集:

```yaml
if: >
  github.event.deployment_status.state == 'success' &&
  github.event.deployment_status.environment == 'Production'
```

## 5. API 制限について

### Free Plan (無料)

- 月間 500 ツイート
- 1 日あたり約 17 ツイート
- アプリ ID 数: 1 個

詳細: [X API Pricing](https://developer.twitter.com/en/docs/twitter-api/getting-started/about-twitter-api#v2-access-level)

## 参考資料

- [X API v2 Documentation](https://developer.twitter.com/en/docs/twitter-api)
- [OAuth 1.0a Documentation](https://developer.twitter.com/en/docs/authentication/oauth-1-0a)
- [Qiita 記事: Twitter API v2 の使い方](https://qiita.com/neru-dev/items/857cc27fd69411496388)
