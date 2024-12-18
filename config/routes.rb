Rails.application.routes.draw do
  mount RailsAdmin::Engine => "/admin", as: "rails_admin"
  root to: "static_pages#top"
  get "policy", to: "static_pages#policy"
  get "term", to: "static_pages#term"
  get "user_sessions/new"
  get "user_sessions/create"
  get "login", to: "user_sessions#new"
  post "login", to: "user_sessions#create"
  delete "logout", to: "user_sessions#destroy"

  resources :users, only: %i[new create]
  resource :my_page, only: %i[show edit update]
  resources :shops, only: %i[show] do 
    resources :reviews, only: %i[index new create destroy edit update], shallow: true
  end
  get "home", to: "maps#home"
  match "search", to: "maps#search", via: [:get]
end
