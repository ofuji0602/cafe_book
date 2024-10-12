Rails.application.routes.draw do
  get "user_sessions/new"
  get "user_sessions/create"
  root to: "static_pages#top"
  resources :users, only: %i[new create]
  get 'login', to:'user_sessions#new'
  post 'login', to:'user_sessions#create'
end
