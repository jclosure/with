# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do

 sequence :email do |n|
    "email#{n}@factory.com"
  end

  factory :user do
    name 'Test User'
    email
    password 'please'
    password_confirmation 'please'
    # required if the Devise Confirmable module is used
    # confirmed_at Time.now
  end
end