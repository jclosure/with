require 'nokogiri'
require 'open-uri'

class MarkletController < ApplicationController
  

  def index
    unless ([80, 443].include? request.port) 
      @url_base = "//#{request.host}:#{request.port}" #assume protocol that link was created from (recommend creating under ssl)
    end
    @url_base ||= "//#{request.host}" #assume protocol that link was created from (recommend creating under ssl)
  end
  def playground
    @users = User.all
  end
  def rc
    @url = params[:source]
    render :layout => 'marklet_uber'
  end
  def capture
    @text = params[:text] || "<div>Text not sent.</div>"
    @text = strip_script_tags(@text)
    @tags = %w{java ruby javascript c# c++}.sort
    @url = params[:source] || "Source not sent."
    render :layout => 'marklet_uber' 
  end

  private

  def strip_script_tags(text)
    doc = Nokogiri::HTML(text)
    doc.xpath("//script").remove
    text = doc.xpath("//body/*[1]")[0].serialize(:encoding => 'UTF-8') do |config|
      config.format.as_xml
    end
  end

end