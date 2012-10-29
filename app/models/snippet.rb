class Snippet
  include Mongoid::Document
  field :source_url, :type => String
  field :content, :type => String
  field :user_id, :type => String
end
