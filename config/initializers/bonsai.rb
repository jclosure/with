require 'tire'
#Tire::Configuration.url "http://c7ji5kc:jvzsl54de3fqnu8v@jasmine-1709588.us-east-1.bonsai.io"
#Tire::Configuration.url "http://localhost:9200"

ENV['ELASTICSEARCH_URL'] = ENV['BONSAI_URL']

# Tire.configure do |variable|
#   url ENV['BONSAI_URL']
# end

# # Optional, but recommended: use a single index per application per environment
app_name = Rails.application.class.parent_name.underscore.dasherize
app_env = Rails.env
INDEX_NAME = "#{app_name}-#{app_env}"