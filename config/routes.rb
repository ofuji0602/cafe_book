Rails.application.routes.draw do
  get "user_sessions/new"
  get "user_sessions/create"
  root to: "static_pages#top"
  get 'login', to:'user_sessions#new'
  post 'login', to:'user_sessions#create'
  delete 'logout', to: 'user_sessions#destroy'

  resources :users, only: %i[new create]
end
