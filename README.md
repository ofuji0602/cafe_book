# cafe-book
サービスURL：https://cafe-book.onrender.com/
## ■サービス概要
「cafe-book」は、読書好きのためのショップ検索サービスです。マップ上から本屋・カフェの検索が可能で、詳細情報を確認できます。
## ■このサービスへの思い・作りたい理由
プログラミング学習を始めた頃、読書する場所を探すのが大変だと感じ、気軽に探せる専用アプリの開発を思いつきました。そこで読書に適した場所を簡単に見つけられる「cafe-book」を作成しました。今後は現在地からの検索とおすすめの場所を共有できるように投稿機能を追加したいと考えています。

## 主な機能

### ■機能一覧
- マップ検索
  - マップをスワイプすると、サークル内で自動検索がかかります。
- フィルター検索
  - カフェのみ、本屋のみでのフィルター検索が可能です。
  - カフェ・本屋詳細機能
	  - 店名、住所、電話番号、営業時間、店舗画像の詳細情報を確認できる。
- ショップレビュー
  -  ショップ詳細画面でショップへのレビューをすることができます。
- 会員登録
  - ログイン・ログアウト
  - マイページ

### ■使用技術
## バックエンド
- Ruby
- Ruby on Rails
- PostgreSQL
- gem
  - sorcery
  - google_places
  - gon
  - geokit-rails
- API
  - Google Maps JavaScript API
  - Google Places API
  - Google Geolocation API
### フロントエンド
- Tailwind CSS
- Hotwire(Turbo, Stimulus)
### インフラ
- Render.com

## ■画面遷移図
https://www.figma.com/design/9ObfslEtdV2MVdm0UJzu7D/cafe-book?node-id=2-2&node-type=canvas&t=eUi6syxBIddohksi-0
## ■ER図
<img width="759" alt="02a1e88df84efccf471fbe712e263901" src="https://github.com/user-attachments/assets/15ef5f09-17f5-4994-8913-e62d56f9353d">