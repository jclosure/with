class Snippet
  include Mongoid::Document
  field :source_url, :type => String
  referenced_in :user
end
