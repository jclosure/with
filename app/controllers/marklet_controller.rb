class MarkletController < ApplicationController
  def options
      render :nothing => true, :status => 204
      response.headers['Access-Control-Allow-Origin'] = '*'
      response.headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
      response.headers['Access-Control-Allow-Credentials'] = 'true'
      response.headers['Access-Control-Max-Age'] = '86400' # 24 hours
      response.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
    end

  
  
  def index
    unless ([80, 443].include? request.port) 
      @url_base = "http://#{request.host}:#{request.port}"
    end
    @url_base ||= "http://#{request.host}"
  end
  def capture
    @text = params[:text] || "Text not sent."
    @url = params[:source] || "Source not sent."
    render :layout => 'marklet_uber' 
  end
end
