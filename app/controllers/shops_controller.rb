class ShopsController < ApplicationController
  
  def show
    @shop = Shop.find(params[:id])
    @shop_images = @shop.shop_images
    @reviews = @shop.reviews.includes(:user).order(created_at: :desc)
  end
end
