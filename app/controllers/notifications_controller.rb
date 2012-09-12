class NotificationsController < ApplicationController
  def index
  end

  def create
    Notifier.test_message #args will be passed later
    flash[:notice] = "Your message has been sent."
    redirect_to root_path
  end
end
