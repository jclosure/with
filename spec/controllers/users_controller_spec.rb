require 'spec_helper'

describe UsersController do

  login_user

  describe "GET 'show'" do
    it "returns http success" do
      user = FactoryGirl.create(:user)
      User.stub(:find).and_return(user)
      get 'show', :id => user._id 
      response.should be_success
    end
  end


end
