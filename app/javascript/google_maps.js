var map;
var pin;
var circle;
var marker;
var lat = gon.latitude;
var lng = gon.longitude;
var booksMarker = [];
var cafesMarker = [];
var API_KEY = gon.api_key;

// 地図の初期化
window.initMap = function() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: new google.maps.LatLng(lat, lng),
    mapTypeId: "roadmap",
    zoomControl: true,
    streetViewControl: true,
    fullscreenControl: false,
    mapTypeControl: false,
    draggable: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    gestureHandling: "greedy",
    styles: [
      {
        featureType: "all",
        elementType: "all"
      },
      {
        featureType: "poi",
        elementType: "all",
        stylers: [
          { visibility: "off" }
        ]
      }
    ]
  });

  // ピンの初期化
  pin = new google.maps.Marker({
    map,
    draggable: true,
    position: new google.maps.LatLng(lat, lng)
  });

  // サークルの初期化
  circle = new google.maps.Circle({
    map,
    center: new google.maps.LatLng(lat, lng),
    radius: 1e3,  // 半径1km
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35
  });

  // マップをドラッグした時の動作
  map.addListener("dragend", function() {
    pin.setPosition(map.getCenter());
    circle.setCenter(map.getCenter());

    var circleCenter = circle.getCenter();
    var radius = circle.getRadius();

    // サークルの東西南北の緯度経度を取得
    var circleBounds = {
      north: circleCenter.lat() + radius / 111111,
      south: circleCenter.lat() - radius / 111111,
      east: circleCenter.lng() + radius / (111111 * Math.cos(circleCenter.lat() * Math.PI / 180)),
      west: circleCenter.lng() - radius / (111111 * Math.cos(circleCenter.lat() * Math.PI / 180))
    };

    // mapsコントローラのhomeアクションへアクセス（json形式）
    fetch(`/home.json?north=${circleBounds.north}&south=${circleBounds.south}&east=${circleBounds.east}&west=${circleBounds.west}`)
      .then(response => response.json())
      .then(data => {
        clearMarkers();
        addMarkers(data.books, "Book");
        addMarkers(data.cafes, "Cafe");

        const booksListElement = document.getElementById("books-list");

        // 以前の内容をクリア
        if (booksListElement) {
          booksListElement.innerHTML = ""; // innerHTMLをクリアする
        } else {
          console.error("Books list element not found");
        }

        // ヒットしたショップを一覧で表示する（書店）
        if (data.books.length > 0) {
          data.books.forEach((shop) => {
            const book_image = shop.shop_images[0]; // 修正点：book_imageを取得

            const shopCard = document.createElement("div");
            shopCard.className = "card bg-base-200 border-gray-500 shadow-xl m-5 w-800";

            const cardContent = `
              <div class="flex">
                <img src="https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photo_reference=${book_image.image}&key=${API_KEY}" class="p-5 w-48 h-48 object-cover" style="width: 200px; height: 140px;">
                <div class="flex-col">
                  <ul>
                    <li class="text-lg mt-4 underline font-bold"><a href="/shops/${shop.id}">${shop.name}</a></li>
                    <li class="text-base">${shop.address}</li>
                    <li class="text-xs">${shop.phone_number}</li>
                  </ul>
                </div>
              </div>
            `;
            shopCard.innerHTML = cardContent;
            booksListElement.appendChild(shopCard);
          });
        } else {
          // ショップが存在しない場合の処理
          const noBooksShopElement = document.createElement("p");
          noBooksShopElement.textContent = "周辺にショップが見つかりませんでした";
          noBooksShopElement.className = "text-base mt-4 text-center";
          booksListElement.appendChild(noBooksShopElement);
        }

        const cafesListElement = document.getElementById('cafes-list');

        // 以前の内容をクリア
        if (cafesListElement) {
          cafesListElement.innerHTML = ''; // innerHTMLをクリアする
        } else {
          console.error("Cafes list element not found");
        }

        // ヒットしたショップの一覧を表示（カフェ）
        if (data.cafes.length > 0) {
          data.cafes.forEach((shop) => {
            const cafe_image = shop.shop_images[0]; // 修正点：cafe_imageを取得
            const shopCard = document.createElement("div");
            shopCard.className = "card bg-base-200 border-gray-500 shadow-xl m-5 w-800";

            const cardContent = `
              <div class="flex">
                <img src="https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photo_reference=${cafe_image.image}&key=${API_KEY}" class="p-5 w-48 h-48 object-cover" style="width: 200px; height: 140px;">
                <div class="flex-col">
                  <ul>
                    <li class="text-lg underline font-bold mt-4"><a href="/shops/${shop.id}">${shop.name}</a></li>
                    <li class="text-base">${shop.address}</li>
                    <li class="text-xs">${shop.phone_number}</li>
                  </ul>
                </div>
              </div>
            `;
            shopCard.innerHTML = cardContent;
            cafesListElement.appendChild(shopCard);
          });
        } else {
          // ショップが存在しない場合の処理
          const noCafeShopElement = document.createElement("p");
          noCafeShopElement.textContent = "周辺にショップが見つかりませんでした";
          noCafeShopElement.className = "text-base mt-4 text-center";
          cafesListElement.appendChild(noCafeShopElement);
        }
      })
      .catch((error) => console.error("Error:", error));
  });

  // ピンをドラッグした時の動作
  pin.addListener("dragend", function() {
    circle.setCenter(pin.getPosition());
  });
};

// マーカーを表示する
function addMarkers(shops, type) {
  for (var i = 0; i < shops.length; i++) {
    var markerIcon = "/assets/" + type.toLowerCase() + "_" + (i + 1) + ".png"; // アイコンの指定

    marker = new google.maps.Marker({
      map: map,
      position: new google.maps.LatLng(shops[i].latitude, shops[i].longitude),
      icon: {
        url: markerIcon,
        scaledSize: new google.maps.Size(80, 80) // マーカーのサイズを設定
      }
    });

    if (type === "Book") {
      booksMarker.push(marker); // 書店マーカーを保存
    } else if (type === "Cafe") {
      cafesMarker.push(marker); // カフェマーカーを保存
    }
  }
}

// マーカーを削除する
function clearMarkers() {
  for (var i = 0; i < booksMarker.length; i++) {
    booksMarker[i].setMap(null);
  }
  for (var i = 0; i < cafesMarker.length; i++) {
    cafesMarker[i].setMap(null);
  }
  booksMarker = [];
  cafesMarker = [];
}
