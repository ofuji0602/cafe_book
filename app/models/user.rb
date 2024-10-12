class User < ApplicationRecord
  authenticates_with_sorcery!

  validates :password, length: { minimum: 6 }, if: -> { new_record? || changes[:crypted_password] } #スワードの長さが6文字以上であることを要求。
  validates :password, confirmation: true, if: -> { new_record? || changes[:crypted_password] } #確認用パスワード（password_confirmation）と一致することを要求。
  validates :password_confirmation, presence: true, if: -> { new_record? || changes[:crypted_password] } #確認用パスワードが必須であることを要求。

  validates :email, uniqueness: true #メールアドレスが他のユーザーと重複しないようにする。
  validates :name, presence: true, length: {maximum: 255} #name要素を入力必須、255文字まで。
end
