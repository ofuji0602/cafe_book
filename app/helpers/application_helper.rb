# app/helpers/application_helper.rb
module ApplicationHelper
  def flash_background_color(message_type)
    case message_type.to_sym
    when :notice
      "bg-green-500"  # 成功メッセージ用の背景色
    when :alert
      "bg-red-500"   # エラーメッセージ用の背景色
    else
      "bg-gray-500"   # その他のメッセージ用の背景色
    end
  end
end
