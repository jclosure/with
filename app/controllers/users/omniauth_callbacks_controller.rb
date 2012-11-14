class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  
  def facebook
    # You need to implement the method below in your model (e.g. app/models/user.rb)
    @user = User.find_for_facebook_oauth(request.env["omniauth.auth"], current_user)

    @user.remember_me = true

    p "@user.persisted? is " + (@user.persisted? ? "true" : "false")


    # if @user.persisted?
      sign_in_and_redirect @user, :event => :authentication #this will throw if @user is not activated
      set_flash_message(:notice, :success, :kind => "Facebook") if is_navigational_format?
    # else
    #   session["devise.facebook_data"] = request.env["omniauth.auth"] #todo: user session["devise.facebook_data"] to populate a reg form for this user because he's new
    #   redirect_to new_user_registration_url
    # end
  end

  def passthru
    render :file => "#{Rails.root}/public/404.html", :status => 404, :layout => false
    # Or alternatively,
    # raise ActionController::RoutingError.new('Not Found')
  end


end