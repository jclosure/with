class Snippet
  include Mongoid::Document
  field :source_url, :type => String
  field :content, :type => String
  referenced_in :user, :type => User
end
