class MarkletController < ApplicationController
  

  def index
    unless ([80, 443].include? request.port) 
      @url_base = "http://#{request.host}:#{request.port}"
    end
    @url_base ||= "http://#{request.host}"
  end
  def playground
    @users = User.all
  end
  def rc
    @url = params[:source]
    render :layout => 'marklet_uber'
  end
  def capture
    @text = params[:text] || "Text not sent."
    @url = params[:source] || "Source not sent."
    render :layout => 'marklet_uber' 
  end


end


