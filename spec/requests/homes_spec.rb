require 'spec_helper'

describe "Homes" do
  describe "GET /homes" do
  
    it "should have the content 'Snippets'" do
      visit '/home'
      page.should have_content('Snippets')
    end
  
    it "should have the img 'splash_image'" do
      visit '/home'
      page.should have_selector('img', :alt => 'Splash Image')
    end

    it "should have the title 'Home'" do
      visit '/home'
      page.should have_selector('title',
                        :text => "With | Home")
    end

  end
end
