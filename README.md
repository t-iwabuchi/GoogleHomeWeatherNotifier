# GoogleHomeWeatherNotifier
雨が振りそうになったらGoogleHomeに喋ってもらう

## 環境設定
ルードディレクトリに .env という名前で以下のパラメータを記載したファイルを設置する。
```
NODE_GOOGLE_HOME_IP_ADDRESS="xxx.xxx.x.xx"
NODE_YAHOO_APP_ID="xxxxx"
NODE_LATITUDE="xx.xxxxxx"
NODE_LONGITUDE="xxx.xxxxxx"
```

## 実行方法

### インストール
```
npm install
```
次に、使用しているパッケージの[「After “npm install”」](https://github.com/noelportugal/google-home-notifier#after-npm-install)に従って、変更を適用してください。

### 実行
```
npm install pm2 -g
pm2 start cron.js --name Google-Home-Weather-Notifier
```

## トラブルシューティング

### `dns_sd.h`が無いというエラー
以下のようなエラー（実際はもっと長い）が表示されることがあります。
> fatal error: dns_sd.h: そのようなファイルやディレクトリはありません

以下のコマンドを実行してください。
```
sudo apt install libavahi-compat-libdnssd-dev 
```

### `node-gyp rebuild`でエラー
`node-gyp rebuild`でエラーが発生した、という内容のエラーが発生することがあります。

この問題は、Node.jsの古いバージョンを使用することで解決できる場合があります。
Node.jsの8系において、動作することを確認しました。
nvm を使用するなどして、Node.jsの8系で実行してみてください。

### なぜだか音が鳴らない
次のようなエラーが発生することがあります。

```
Error: get key failed from google
    at /home/pi/bin/google-home/GoogleHomeWeatherNotifier/node_modules/google-tts-api/lib/key.js:27:13
    at process._tickCallback (internal/process/next_tick.js:68:7)
```

`google-home-notifier`というパッケージが依存している`google-tts-api`というパッケージのバージョンが古いことが原因です。  
`node_modules/google-home-notifier/package.json`を開き、上側のようになっている箇所を、下側のように変更してください。

```
  "dependencies": {
      "body-parser": "^1.15.2",
      "castv2-client": "^1.1.2",
      "express": "^4.14.0",
      "google-tts-api": "https://github.com/darrencruse/google-tts/tarball/british-voice",
      "mdns": "^2.3.3",
      "ngrok": "^2.2.4"
  },
```

```
  "dependencies": {
      "body-parser": "^1.15.2",
      "castv2-client": "^1.1.2",
      "express": "^4.14.0",
      "google-tts-api": "0.0.4",
      "mdns": "^2.3.3",
      "ngrok": "^2.2.4"
  },
```


具体的には、
```
"google-tts-api": "https://github.com/darrencruse/google-tts/tarball/british-voice",
```
を、
```
"google-tts-api": "0.0.4",
```
に変更してください。
変更前の箇所は `0.0.2` などになっていることがありますが、その場合も　`0.0.4` に変更してください。
