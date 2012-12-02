require 'sunspot_mongo'

class Snippet
  include Mongoid::Document
  include Sunspot::Mongo
  
 

  field :source_url, :type => String
  field :content, :type => String
  field :user_id, :type => String
  belongs_to :user, :class_name => "User", :inverse_of => :snippets, :autosave => true, :validate => false


  #solr setup
  # searchable do
  #   text :content
  # end
end

