require 'spec_helper'

 
describe User do

  
  
  
 
  it "sends a e-mail" do
    user = FactoryGirl.create(:user)
    user.send_instructions
    ActionMailer::Base.deliveries.last.to.should == [user.email]
  end
end