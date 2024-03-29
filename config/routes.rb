With::Application.routes.draw do
  

  #picks up the cor method from application_controller.rb used for preflight checks
  match '*all' => 'application#cor', :constraints => {:method => 'OPTIONS'} 

  get "notifications/index"

  get "notifications/create"

  root :to => "home#index"
  #devise_for :users

  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  devise_scope :user do
    get '/users/auth/:provider' => 'users/omniauth_callbacks#passthru'
  end

  resources :users, :only => :show

  get "snippets/search"
 


  resources :snippets do
    member { post :vote }
  end

 

  get "marklet/index"
  get "marklet/capture"
  get "marklet/playground"
  get "marklet/rc"
  get "home/index"


  #BARE ROUTES
  match ':controller/:id/bare' => ':controller#show'
  #match ':controller(/:action(/:id(/bare)))(.:format)'
 #get '/:controller/:id/bare', to: ':controller/:action/:id'

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  match ':controller(/:action(/:id))(.:format)'



  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # See how all your routes lay out with "rake routes"


end
