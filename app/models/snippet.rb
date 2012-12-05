#solr setup
#require 'sunspot_mongo'

class Snippet
  include Mongoid::Document
  

 

  field :source_url, :type => String
  field :content, :type => String
  field :user_id, :type => String
  belongs_to :user, :class_name => "User", :inverse_of => :snippets, :autosave => true, :validate => false


  #solr setup
  #include Sunspot::Mongo
  # searchable do
  #   text :content
  # end


  #tire for elasticsearch setup
  include Tire::Model::Search
  include Tire::Model::Callbacks

  #index_name INDEX_NAME

  # mapping do
  #   indexes :url
  #   indexes :content
  # end

  def self.search(params)
    tire.search(load: true) do
      query { string params[:query], default_operator: "AND" } if params[:query].present?
      #filter :range, published_at: {lte: Time.zone.now}
    end
  end



end

