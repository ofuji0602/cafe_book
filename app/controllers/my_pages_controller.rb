class MyPagesController < ApplicationController
  before_action :set_user, only: %i[show edit update]

  def show; end

  def edit; end

  def update
    if @user.update(user_params)
      redirect_to my_page_path, notice: "ユーザー情報の更新に成功しました"
    else
      flash.now["alert"] = "ユーザー情報の更新に失敗しました"
      render :edit, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(current_user.id)
  end

  def user_params
    params.require(:user).permit(:name, :email, :avatar, :avatar_cache)
  end
end
