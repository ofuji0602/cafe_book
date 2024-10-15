Rails.application.routes.draw do
  root to: "static_pages#top"
  get "policy", to: "static_pages#policy"
  get "term", to: "static_pages#term"
  get "user_sessions/new"
  get "user_sessions/create"
  get "login", to: "user_sessions#new"
  post "login", to: "user_sessions#create"
  delete "logout", to: "user_sessions#destroy"

  resources :users, only: %i[new create]
end
