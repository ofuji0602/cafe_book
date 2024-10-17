class AvatarUploader < CarrierWave::Uploader::Base
  # MiniMagickを使用して画像の加工を行うための設定
  include CarrierWave::MiniMagick
  # アップロードされた画像を中央を基準にして400x400にトリミング
  process resize_to_fill: [ 400, 400, "Center" ]
  # ストレージにローカルファイルシステムを使用
  storage :file
  # もし外部ストレージ（例: Amazon S3）を使用する場合は下記のコメントを外す
  # storage :fog

  # 画像の保存先ディレクトリを指定する
  def store_dir
    # アップロードされたファイルは次のパスに保存される
    # uploads/user/avatar/1/ のような形になる
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  # 画像が存在しない場合に表示するデフォルトのURLを指定
  def default_url
    # デフォルトの画像として"default.png"を使用する
    "default.png"
    # Railsのアセットパイプラインに含まれるファイルを指定する場合は以下を使う
    # ActionController::Base.helpers.asset_path("fallback/" + [version_name, "default.png"].compact.join('_'))
  end

  # アップロードされた画像ファイルの拡張子を制限する
  def extension_allowlist
    # jpg, jpeg, gif, png のみ許可する
    %w[ jpg jpeg gif png ]
  end

  # 画像の異なるバージョンを作成する（コメントアウトされているが、必要に応じて使う）
  # version :thumb do
  #   # サムネイル画像として50x50ピクセルのサイズにリサイズ
  #   process resize_to_fit: [50, 50]
  # end

  # ファイル名をカスタマイズする場合にこのメソッドを使用（通常は不要）
  # def filename
  #   # ファイル名を "something.jpg" に変更
  #   "something.jpg" if original_filename
  # end
end
