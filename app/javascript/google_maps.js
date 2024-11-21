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
        zoom: 15,
        center: new google.maps.LatLng(lat, lng),
        mapTypeId: 'roadmap',
        zoomControl: true,
        streetViewControl: true,
        fullscreenControl: false,
        mapTypeControl: false,
        draggable: true,
        scrollwheel: true,
        disableDoubleClickZoom: true,
        gestureHandling: 'greedy',
        styles: [
            { featureType: 'all', elementType: 'all' },
            {
                featureType: 'poi',
                elementType: 'all',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });

    // ピンの初期化
    pin = new google.maps.Marker({
        map: map,
        draggable: true,
        position: new google.maps.LatLng(lat, lng)
    });

    // サークルの初期化
    circle = new google.maps.Circle({
        map: map,
        center: new google.maps.LatLng(lat, lng),
        radius: 1000,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35
    });

    // 現在地移動ボタンを追加
    var currentLocationButton = document.createElement('button');
    currentLocationButton.textContent = "現在地へ移動";
    currentLocationButton.className = "border-2 rounded-full border-gray-300 bg-gray-300 py-2 px-4 md:px-8 mt-2 mr-2 text-center text-xs md:text-base text-white font-bold hover:bg-gray-400 active:bg-gray-500";
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(currentLocationButton);

    // 現在地移動ボタンのクリックイベント
    currentLocationButton.addEventListener('click', function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    lat = position.coords.latitude;
                    lng = position.coords.longitude;
                    pin.setPosition(new google.maps.LatLng(lat, lng));
                    circle.setCenter(new google.maps.LatLng(lat, lng));
                    map.setCenter(new google.maps.LatLng(lat, lng));
                },
                () => {
                    handleLocationError(true, map.getCenter());
                }
            );
        } else {
            handleLocationError(false, map.getCenter());
        }
    });

    // イベントリスナーを追加
    document.getElementById('search-books-button').addEventListener('click', function () {
        currentFilter = 'books';
        performSearch(currentFilter);
    });

    document.getElementById('search-cafe-button').addEventListener('click', function () {
        currentFilter = 'cafe';
        performSearch(currentFilter);
    });

    map.addListener('dragend', updateSearch);
    pin.addListener('dragend', updateSearch);
}

// 検索を更新する関数
function updateSearch() {
    pin.setPosition(map.getCenter());
    circle.setCenter(map.getCenter());
    performSearch(currentFilter);
}

// 検索を実行する関数
function performSearch(filterType) {
    var circleCenter = circle.getCenter();
    var radius = circle.getRadius();

    var circleBounds = {
        north: circleCenter.lat() + radius / 111111,
        south: circleCenter.lat() - radius / 111111,
        east: circleCenter.lng() + radius / (111111 * Math.cos(circleCenter.lat() * Math.PI / 180)),
        west: circleCenter.lng() - radius / (111111 * Math.cos(circleCenter.lat() * Math.PI / 180))
    };

    const filterParam = (filterType === 'cafe')
        ? 'is_cafe_filter=true'
        : (filterType === 'books')
            ? 'is_books_filter=true'
            : '';

    fetch(`/home.json?north=${circleBounds.north}&south=${circleBounds.south}&east=${circleBounds.east}&west=${circleBounds.west}&${filterParam}`)
        .then(response => response.json())
        .then(data => {
            clearMarkers();
            updateShopList('books', data.books);
            updateShopList('cafes', data.cafes);
        })
        .catch(error => console.error('Error:', error));
}

// ショップリストを更新する関数
function updateShopList(type, shops) {
    const shopsListElement = document.getElementById(`${type}-list`);
    shopsListElement.innerHTML = '';

    if (shops && shops.length > 0) {
        addMarkers(shops, type);

        shops.forEach(shop => {
            const shop_image = shop.shop_images[0];
            const shopCard = document.createElement('div');
            shopCard.className = 'card rounded bg-base-200 border-gray-500 shadow-xl m-2 md:m-3 w-[330px] md:w-[700px] mx-auto';

            const cardContent = `
                <div class="flex" data-controller="modal">
                    <img src="https://maps.googleapis.com/maps/api/place/photo?maxheight=400&maxwidth=400&photo_reference=${shop_image.image}&key=${API_KEY}" class="p-2 md:p-5 w-24 h-24 md:w-48 md:h-48 rounded">
                    <div class="flex-col">
                        <ul>
                            <li class="text-[9px] font-bold md:pl-4 pt-3 md:text-sm w-full"><a href="/shops/${shop.id}">${shop.name}</a></li>
                            <li class="text-[7px] pl-1 md:pl-4 mt-1 md:mt-1.5 md:text-xs w-full">${shop.address}</li>
                            <li class="text-[7px] pl-1 md:pl-4 mt-1 md:mt-1.5 md:text-xs w-full">${shop.phone_number}</li>
                        </ul>
                    </div>
                </div>
            `;
            shopCard.innerHTML = cardContent;
            shopsListElement.appendChild(shopCard);
        });
    } else {
        const noShopsElement = document.createElement('p');
        noShopsElement.textContent = '周辺にショップが見つかりませんでした';
        noShopsElement.className = 'text-base pt-5 text-center';
        shopsListElement.appendChild(noShopsElement);
    }
}

// マーカーを追加する関数
function addMarkers(shops, type) {
    const markers = (type === 'books') ? booksMarker : cafesMarker;

    for (var i = 0; i < shops.length && i < maxMarkers; i++) {
        var markerIcon = {
            url: '/images/' + type.toLowerCase() + '_' + (i + 1) + '.png',
            scaledSize: new google.maps.Size(70, 70)
        };

        var marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(shops[i].latitude, shops[i].longitude),
            icon: markerIcon
        });

        markers.push(marker);
    }
}

// 以前のマーカーをクリアする関数
function clearMarkers() {
    booksMarker.forEach(marker => marker.setMap(null));
    cafesMarker.forEach(marker => marker.setMap(null));
    booksMarker = [];
    cafesMarker = [];
}

// initMap関数をグローバルスコープに公開
window.initMap = initMap;
