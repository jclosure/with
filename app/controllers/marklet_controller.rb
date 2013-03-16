require 'nokogiri'
require 'open-uri'

class MarkletController < ApplicationController
  

  def index
    #my view relies on before_filter :set_url_base
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
    
    #todo: make this more effecient with a diff tags sln
    #@tags = %w{java ruby javascript c# c++}.sort
    @tags = []
    Snippet.all.each do |snippet| 
      @tags.concat snippet.tags.split(',') if snippet.tags
    end
    @tags = @tags.uniq.sort

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