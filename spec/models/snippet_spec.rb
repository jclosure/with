require 'spec_helper'

describe Snippet do
  it "can search content" do
  	s1 = FactoryGirl.create(:snippet)
  	s1.content = "abc"
    Snippet.stub(:find).and_return(s1)
    needle = 'a'
  	Snippet.search({arg: needle}) do
	  fulltext needle

	  # with :blog_id, 1
	  # with(:published_at).less_than Time.now
	  # order_by :published_at, :desc
	  # paginate :page => 2, :per_page => 15
	  # facet :category_ids, :author_id
	end
  end
end
