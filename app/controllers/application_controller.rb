class ApplicationController < ActionController::Base


    add_breadcrumb :index, :root_path
    
    #FB_GRAPH
    rescue_from FbGraph::Exception, :with => :fb_graph_exception

    def fb_graph_exception(e)
      flash[:error] = {
        :title   => e.class,
        :message => e.message
      }
      current_user.try(:destroy)
      redirect_to root_url
    end

    #note: temporarily disabled to prevent this from tearing down auth on post from remote site during snippet collection
    #todo: look into overrideing forgery_whitelisted? method in  File actionpack/lib/action_dispatch/http/request.rb, line 126 by stashing uri or fqdn, and then session lookup of current remote site as fix => http://zadasnotes.blogspot.com/2010/11/rails-3-forgery-csrf-protection-for.html
    #protect_from_forgery
    
    before_filter :set_params
    before_filter :set_bare
    before_filter :cor
    before_filter :set_url_base
  	before_filter :set_fb_app
    before_filter :bare_referrers
    before_filter :set_full_url

  	#before_filter :sign_in_redirect_hack
	  #before_filter :store_location

	def cor
		headers["Access-Control-Allow-Origin"] = "*"
		headers["Access-Control-Allow-Methods"] = %w{GET POST PUT DELETE}.join(",")
		headers["Access-Control-Allow-Headers"] = %w{Origin Accept Content-Type X-Requested-With X-CSRF-Token}.join(",")
		head(:ok) if request.request_method == "OPTIONS"
	end

  def set_fb_app
    @fb_app_id = FACEBOOK_APP_ID #note this assumes that the key is found on this constant
  end

  def set_bare
    @bare = request.original_url[/\/bare$/]
    @bare = @bare || (params[:bare].present? and (params[:bare] != "false")) ? true : set_bare_session()
  end

  def set_bare_session
    @bare = session[:bare] = params[:bare_session].present? ? (params[:bare_session] != "false") || false : session[:bare]
  end

  def set_params
    @params = params || []  
  end

  def set_url_base
    unless ([80, 443].include? request.port) 
      @url_base = "//#{request.host}:#{request.port}" #assume protocol that link was created from (recommend creating under ssl)
    end
    @url_base ||= "//#{request.host}" #assume protocol that link was created from (recommend creating under ssl)
  end
  
  def set_full_url
    @full_url = "#{request.protocol}#{request.host_with_port}#{request.fullpath}"
  end


  def after_sign_in_path_for(resource)                                                                                                                      
    sign_in_url = url_for(:action => 'new', :controller => 'sessions', :only_path => false, :protocol => 'http')                                            
    if request.referer == sign_in_url                                                                                                                    
      super                                                                                                                                                 
    else                                                                                                                                                    
      stored_location_for(resource) || request.referer || root_path                                                                                         
    end                                                                                                                                                     
  end 
  
  #TODO: FIX HACK - ALL GOING TO /SNIPPETS NOW             
  def bare
    #session[:bare] = true
    p "groko"
    fb_data = base64_url_decode params[:signed_request]
    p fb_data.to_yaml
    redirect_to "/snippets"
    # redirect_to request.url[/\/bare/] = '' #=> broken resolves to /  
  end

  def bare_referrers
    if (request.referer && (request.referer.include? "://apps.facebook.com"))
      @bare = session[:bare] = true
    end
  end

  #helpers

  def base64_url_decode str
   encoded_str = str.gsub('-','+').gsub('_','/')
   encoded_str += '=' while !(encoded_str.size % 4).zero?
   Base64.decode64(encoded_str)
  end

  def decode_data str
   encoded_sig, payload = str.split('.')
   data = ActiveSupport::JSON.decode base64_url_decode(payload)
  end

end
