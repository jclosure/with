source 'https://rubygems.org'
ruby "1.9.3"

#required to force bundler @ heroku to use ruby 1.9.3
#gem install bundler -pre

gem 'rails', '3.2.11'
gem 'jquery-rails'

gem "nokogiri"

gem "heroku"
gem "figaro"

group :assets do
  gem 'sass-rails',   '~> 3.2.3'
  gem 'coffee-rails', '~> 3.2.1'
  gem 'uglifier', '>= 1.0.3'
end

gem "therubyracer"
gem "less-rails" #Sprockets (what Rails 3.1 uses for its asset pipeline) supports LESS
gem 'twitter-bootstrap-rails', :git => 'git://github.com/seyhunak/twitter-bootstrap-rails.git'

gem "rspec-rails", ">= 2.11.0", :group => [:development, :test]
gem "factory_girl_rails", ">= 4.0.0", :group => [:development, :test]
gem "database_cleaner", ">= 0.8.0", :group => :test
gem "email_spec", ">= 1.2.1", :group => :test
gem "cucumber-rails", ">= 1.3.0", :group => :test, :require => false
gem "launchy", ">= 2.1.2", :group => :test

gem "devise", ">= 2.1.2"
gem 'omniauth'
gem 'oauth2'
gem 'omniauth-facebook'

gem "mongoid", ">= 3.0.3"
#gem 'voteable_mongo'
gem 'voteable_mongo', :git => 'https://github.com/dementrock/voteable_mongo.git'
gem "will_paginate_mongoid"
gem "mongoid-rspec", ">= 1.4.6", :group => :test

#solr mongo
# gem 'moped'
# gem "sunspot_mongo", :git => "git://github.com/jclosure/sunspot_mongo.git"
# gem 'sunspot_solr'

#tire for elastic search
gem 'tire'
gem 'rake' , '>= 0.9.2'


gem "pg", :group => [:production]
gem "thin", :group => [:production]

group :test, :development do
  gem 'guard'
  gem 'guard-rspec'
  gem 'growl'
  gem 'capybara', '1.1.2'
  gem 'rb-inotify', :require => false
  gem 'rb-fsevent', :require => false
  gem 'rb-fchange', :require => false
  gem 'guard-rspec'
  gem 'guard-livereload'
  gem 'rb-readline'
  gem 'guard-spork', '1.2.0'
  gem 'spork', '0.9.2'
  gem "debugger"
end

#gem "psych"
gem "better_errors", ">= 0.3.2", :group => :development
gem "binding_of_caller", ">= 0.6.8", :group => :development



#FB
gem 'fb_graph'

# #social stream
# gem 'social_stream', '>= 1.0.0'
# gem 'social_stream-documents'
# gem 'social_stream-linkser'

