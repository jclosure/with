class Snippet
  include Mongoid::Document
  field :source_url, :type => String
  field :content, :type => String
  embedded_in :user
end
