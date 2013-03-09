class HomeController < ApplicationController
  def index
    # @fb_user = FbGraph::User.new('me', access_token: session[:fb_access_token]).fetch
  	
    @users = User.all
  end
end
