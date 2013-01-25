require 'spec_helper'

describe MarkletController do
  
  before :all do
  	@marklet_controller = MarkletController.new
  end


  it "strips the script tags from captured content" do
  	text = "<div><div>monkey</div><script>asdf = 234;</script></div>"
  	result = @marklet_controller.send(:strip_script_tags, text)
  	result.should_not include("script")
  end

end
