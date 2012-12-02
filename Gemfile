source 'https://rubygems.org'
ruby "1.9.3"

#required to force bundler @ heroku to use ruby 1.9.3
#gem install bundler -pre

gem 'rails', '3.2.8'
group :assets do
  gem 'sass-rails',   '~> 3.2.3'
  gem 'coffee-rails', '~> 3.2.1'
  gem 'uglifier', '>= 1.0.3'
end
gem 'jquery-rails'
gem "mongoid", ">= 3.0.3"
gem "rspec-rails", ">= 2.11.0", :group => [:development, :test]
gem "database_cleaner", ">= 0.8.0", :group => :test
gem "mongoid-rspec", ">= 1.4.6", :group => :test
gem "email_spec", ">= 1.2.1", :group => :test
gem "cucumber-rails", ">= 1.3.0", :group => :test, :require => false
gem "launchy", ">= 2.1.2", :group => :test
gem "factory_girl_rails", ">= 4.0.0", :group => [:development, :test]
gem "devise", ">= 2.1.2"

gem 'omniauth'
gem 'oauth2'
gem 'omniauth-facebook'

#solr mongo
gem 'bson_ext'
gem "sunspot_mongo", :git => "git://github.com/balexand/sunspot_mongo.git", :branch => "fix_rake_sunspot_reindex"
gem 'sunspot_solr'

gem "pg", :group => [:production]
gem "thin", :group => [:production]

group :test, :development do
  gem 'guard'
  gem 'guard-rspec'
  gem 'growl'
  gem 'capybara', '1.1.2'
  gem 'rb-inotify', :require => false
  #gem 'rb-fsevent', :require => false if RUBY_PLATFORM =~ /darwin/i
  gem 'rb-fsevent', :require => false
  gem 'rb-fchange', :require => false
  gem 'guard-rspec'
  gem 'guard-livereload'
  gem 'rb-readline'
  gem 'guard-spork', '1.2.0'
  gem 'spork', '0.9.2'
end



