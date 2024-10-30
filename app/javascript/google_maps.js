// 地図関連の変数を定義
var map; // Google Mapsオブジェクト
var pin; // ユーザーがドラッグできるピン
var circle; // 検索範囲を示す円
var lat = gon.latitude; // 初期の緯度
var lng = gon.longitude; // 初期の経度
var booksMarker = []; // 本屋のマーカーを保持する配列
var cafesMarker = []; // カフェのマーカーを保持する配列
var API_KEY = gon.api_key; // Google Maps APIキー

// 現在のフィルターの状態を管理する変数
var currentFilter = 'all'; // 現在のフィルターの種類（初期値はすべて）
var maxMarkers = 10; // 表示する最大マーカー数

// Google Mapsの初期化関数
function initMap() {
    // Google Mapsオブジェクトの作成
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15, // ズームレベル
        center: new google.maps.LatLng(lat, lng), // 地図の中心
        mapTypeId: 'roadmap', // 地図のタイプ
        zoomControl: true, // ズームコントロールを表示
        streetViewControl: true, // ストリートビューコントロールを表示
        fullscreenControl: false, // フルスクリーンコントロールを非表示
        mapTypeControl: false, // 地図タイプコントロールを非表示
        draggable: true, // 地図をドラッグ可能
        scrollwheel: true, // スクロールホイールでズーム可能
        disableDoubleClickZoom: true, // ダブルクリックでズームを無効
        gestureHandling: 'greedy', // ジェスチャー操作を強制
        styles: [ // 地図のスタイル設定
            {
                featureType: 'all',
                elementType: 'all',
            },
            {
                featureType: 'poi', // ポイントオブインタレスト（店舗など）のスタイル
                elementType: 'all',
                stylers: [
                    { visibility: 'off' }, // 表示をオフにする
                ],
            }
        ]
    });

    // ピンの初期化
    pin = new google.maps.Marker({
        map: map,
        draggable: true, // ドラッグ可能なマーカー
        position: new google.maps.LatLng(lat, lng), // 初期位置
    });

    // サークルの初期化
    circle = new google.maps.Circle({
        map: map,
        center: new google.maps.LatLng(lat, lng), // サークルの中心
        radius: 1000, // サークルの半径（メートル）
        strokeColor: "#FF0000", // 線の色
        strokeOpacity: 0.8, // 線の透明度
        strokeWeight: 2, // 線の太さ
        fillColor: "#FF0000", // 塗りつぶしの色
        fillOpacity: 0.35, // 塗りつぶしの透明度
    });

    // 本屋を検索するボタンのイベントリスナーを追加
    document.getElementById('search-books-button').addEventListener('click', function () {
        currentFilter = 'books'; // フィルターを本屋に設定
        performSearch(currentFilter); // 検索を実行
    });

    // カフェを検索するボタンのイベントリスナーを追加
    document.getElementById('search-cafe-button').addEventListener('click', function () {
        currentFilter = 'cafe'; // フィルターをカフェに設定
        performSearch(currentFilter); // 検索を実行
    });

    // 地図をドラッグしたときに検索を更新
    map.addListener('dragend', updateSearch);
    // ピンをドラッグしたときに検索を更新
    pin.addListener('dragend', updateSearch);
}

// 検索を更新する関数
function updateSearch() {
    // ピンの位置を地図の中心に設定
    pin.setPosition(map.getCenter());
    // サークルの中心を地図の中心に設定
    circle.setCenter(map.getCenter());
    // 現在のフィルターで検索を実行
    performSearch(currentFilter);
}

// 検索を実行する関数
function performSearch(filterType) {
    var circleCenter = circle.getCenter(); // サークルの中心
    var radius = circle.getRadius(); // サークルの半径

    // サークルの北、南、東、西の境界を計算
    var circleBounds = {
        north: circleCenter.lat() + radius / 111111,
        south: circleCenter.lat() - radius / 111111,
        east: circleCenter.lng() + radius / (111111 * Math.cos(circleCenter.lat() * Math.PI / 180)),
        west: circleCenter.lng() - radius / (111111 * Math.cos(circleCenter.lat() * Math.PI / 180))
    };

    // フィルターに応じたパラメータを設定
    const filterParam = (filterType === 'cafe') ? 'is_cafe_filter=true' : (filterType === 'books') ? 'is_books_filter=true' : '';

    // サーバーからデータを取得
    fetch(`/home.json?north=${circleBounds.north}&south=${circleBounds.south}&east=${circleBounds.east}&west=${circleBounds.west}&${filterParam}`)
        .then(response => response.json())
        .then(data => {
            clearMarkers(); // 以前のマーカーをクリア
            updateShopList('books', data.books); // 書店のリストを更新
            updateShopList('cafes', data.cafes); // カフェのリストを更新
        })
        .catch(error => console.error('Error:', error)); // エラーハンドリング
}

// ショップリストを更新する関数
function updateShopList(type, shops) {
    const shopsListElement = document.getElementById(`${type}-list`); // リスト要素を取得
    shopsListElement.innerHTML = ''; // リストをクリア

    if (shops && shops.length > 0) { // ショップが存在する場合
        addMarkers(shops, type); // マーカーを追加

        // 各ショップの情報をリストに追加
        shops.forEach(shop => {
            const shop_image = shop.shop_images[0]; // 画像を取得

            const shopCard = document.createElement('div'); // 新しいカードを作成
            shopCard.className = 'card bg-base-200 border-gray-500 shadow-xl m-5'; // カードのクラスを設定

            // カードの内容を設定
            const cardContent = `
                <div class="flex rounded">
                  <img src="https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photo_reference=${shop_image.image}&key=${API_KEY}" class="p-5 w-48 h-48 object-cover" style="width: 200px; height: 140px;">
                  <div class="flex-col">
                    <ul>
                      <li class="text-lg mt-4 underline font-bold"><a href="/shops/${shop.id}">${shop.name}</a></li>
                      <li class="text-base">${shop.address}</li>
                      <li class="text-xs">${shop.phone_number}</li>
                    </ul>
                  </div>
                </div>
            `;

            shopCard.innerHTML = cardContent; // カードに内容を設定
            shopsListElement.appendChild(shopCard); // リストにカードを追加
        });
    } else { // ショップが存在しない場合
        const noShopsElement = document.createElement('p'); // 「ショップがない」メッセージを作成
        noShopsElement.textContent = '周辺にショップが見つかりませんでした'; // メッセージのテキストを設定
        noShopsElement.className = 'text-base pt-5 text-center'; // スタイルを設定
        shopsListElement.appendChild(noShopsElement); // リストにメッセージを追加
    }
}

// マーカーを追加する関数
function addMarkers(shops, type) {
  // タイプに応じたマーカー配列を選択
  const markers = (type === 'books') ? booksMarker : cafesMarker;

  // ショップの数だけマーカーを追加
  for (var i = 0; i < shops.length && i < maxMarkers; i++) {
      var markerIcon = {
          url: '/images/' + type.toLowerCase() + '_' + (i + 1) + '.png', // アイコンのパスを設定
          scaledSize: new google.maps.Size(70, 70) // アイコンのサイズを指定
      };

      // マーカーを作成
      var marker = new google.maps.Marker({
          map: map, // マップに追加
          position: new google.maps.LatLng(shops[i].latitude, shops[i].longitude), // マーカーの位置
          icon: markerIcon // マーカーのアイコン
      });

      markers.push(marker); // マーカーを配列に追加
  }
}


// 以前のマーカーをクリアする関数
function clearMarkers() {
    // 本屋のマーカーを地図から削除
    booksMarker.forEach(marker => marker.setMap(null));
    // カフェのマーカーを地図から削除
    cafesMarker.forEach(marker => marker.setMap(null));
    // マーカーの配列を空にする
    booksMarker = [];
    cafesMarker = [];
}

// initMap関数をグローバルスコープに公開
window.initMap = initMap;
