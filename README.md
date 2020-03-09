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
各項目の意味は以下の通りです。
| 項目名 | 概要 | 取得方法 |
|  ---- | ---- |   ----  |
| `NODE_GOOGLE_HOME_IP_ADDRESS` | Google HomeのIPアドレス | Google Homeアプリ |
| `NODE_YAHOO_APP_ID` | Yahoo!デベロッパーネットワーク APIキー | [ご利用ガイド](https://developer.yahoo.co.jp/start/) |
| `NODE_LATITUDE` | 緯度 | Googleマップ等で調べる |
| `NODE_LONGITUDE` | 経度 | Googleマップ等で調べる |

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