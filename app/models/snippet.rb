#solr setup
#require 'sunspot_mongo'

class Snippet
  include Mongoid::Document
  include Mongo::Voteable

 # set points for each vote
  voteable self, :up => +1, :down => -1

  field :source_url, :type => String
  field :tags, :type => String
  #property :tags,         :default => [], :analyzer => 'keyword'
  field :description, :type => String
  field :content, :type => String
  field :text, :type => String
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

  #index_name ELASTISTICSEARCH_INDEX_NAME_PREFIX + "-Snippets"

  def to_indexed_json
    self.to_json
  end

  settings :analyzer => {
            :url_analyzer => {
              'tokenizer' => 'uax_url_email'
            }
    }

  mapping do
    indexes :source_url, :analyzer => :url_analyzer #, :boost => 50
    indexes :text
    indexes :user_id, :index => :not_analyzed
  end

  def self.search(params)
    tire.search(load: true) do
      query { string params[:query], default_operator: "AND" } if params[:query].present?
      filter :term, { user_id: params[:user_id] } if params[:user_id].present?
      #filter :range, published_at: {lte: Time.zone.now}
    end
  end



end

