class MapsController < ApplicationController
  # homeアクションは、地図の中心となるカフェと書店の情報を取得して表示するためのメソッドです。
  def home
    # 初期の緯度、経度をgonに設定し、JavaScriptからアクセスできるようにします。
    gon.latitude = 35.6895  # 新宿駅の緯度
    gon.longitude = 139.6917 # 新宿駅の経度
    gon.api_key = ENV['API_KEY']  # 環境変数からAPIキーを取得

    # リクエストのクエリパラメータから緯度経度の値を取得し、浮動小数点数に変換します。
    north = params[:north].to_f   # 北の境界の緯度
    south = params[:south].to_f   # 南の境界の緯度
    east = params[:east].to_f     # 東の境界の経度
    west = params[:west].to_f     # 西の境界の経度
    
    # 指定された緯度経度の範囲内にあるカフェと書店の情報を取得します。
    # includesメソッドを使用して、関連するshop_imagesも事前に取得します。
    @cafes = Cafe.includes(:shop_images).where(latitude: south..north, longitude: west..east)
    @books = Book.includes(:shop_images).where(latitude: south..north, longitude: west..east)

    # レスポンスの形式に応じて処理を行います。
    respond_to do |format|
      format.html  # HTML形式のレスポンスを準備
      format.json do  # JSON形式のレスポンスを準備
        render json: {
          cafes: @cafes.as_json(include: :shop_images),  # カフェの情報をJSON形式で返す
          books: @books.as_json(include: :shop_images)   # 書店の情報をJSON形式で返す
        }
      end
    end
  end
end
