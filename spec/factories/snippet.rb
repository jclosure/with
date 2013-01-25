# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do

 sequence :source_url do |n|
    "http://testurl.com/blah#{n}.html"
  end
  sequence :content do |n|
    "abc#{n}"
  end

  factory :snippet do
    source_url
    content
  end
end