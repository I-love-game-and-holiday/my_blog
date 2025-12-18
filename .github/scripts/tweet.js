const crypto = require('crypto');
const https = require('https');

// OAuth 1.0a署名を生成する関数
function generateOAuthSignature(method, url, params, consumerSecret, tokenSecret) {
  // パラメータをソート
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  // 署名ベース文字列を作成
  const signatureBaseString = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(sortedParams)
  ].join('&');

  // 署名キーを作成
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;

  // HMAC-SHA1で署名
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(signatureBaseString)
    .digest('base64');

  return signature;
}

// OAuth 1.0aヘッダーを生成する関数
function generateOAuthHeader(method, url, consumerKey, consumerSecret, accessToken, accessTokenSecret) {
  const oauthParams = {
    oauth_consumer_key: consumerKey,
    oauth_token: accessToken,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: crypto.randomBytes(32).toString('base64').replace(/\W/g, ''),
    oauth_version: '1.0'
  };

  // 署名を生成
  const signature = generateOAuthSignature(method, url, oauthParams, consumerSecret, accessTokenSecret);
  oauthParams.oauth_signature = signature;

  // Authorizationヘッダーを作成
  const authHeader = 'OAuth ' + Object.keys(oauthParams)
    .sort()
    .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
    .join(', ');

  return authHeader;
}

// ツイートを投稿する関数
async function postTweet(text) {
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
    throw new Error('Twitter API credentials are not set in environment variables');
  }

  const url = 'https://api.twitter.com/2/tweets';
  const method = 'POST';
  const body = JSON.stringify({ text });

  // OAuth 1.0aヘッダーを生成
  const authHeader = generateOAuthHeader(method, url, apiKey, apiSecret, accessToken, accessTokenSecret);

  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: method,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('Tweet posted successfully!');
          console.log('Response:', data);
          resolve(JSON.parse(data));
        } else {
          console.error('Failed to post tweet');
          console.error('Status:', res.statusCode);
          console.error('Response:', data);
          reject(new Error(`Failed to post tweet: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });

    req.write(body);
    req.end();
  });
}

// メイン処理
async function main() {
  try {
    const deployUrl = process.env.DEPLOY_URL || '';
    
    // ツイート本文を作成
    const tweetText = `新しい記事を公開しました！\n\n${deployUrl}`;
    
    console.log('Posting tweet:', tweetText);
    await postTweet(tweetText);
    console.log('Tweet posted successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();

