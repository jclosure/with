#Tire::Configuration.url "http://c7ji5kc:jvzsl54de3fqnu8v@jasmine-1709588.us-east-1.bonsai.io"
#Tire::Configuration.url "http://localhost:9200"

ENV['ELASTICSEARCH_URL'] = ENV['BONSAI_URL']

# if ENV['BONSAI_INDEX_URL']
#   Tire.configure do
#     url "http://c7ji5kc:jvzsl54de3fqnu8v@jasmine-1709588.us-east-1.bonsai.io"
#   end
#   BONSAI_INDEX_NAME = ENV['BONSAI_INDEX_URL'][/[^\/]+$/]
# else
#   app_name = Rails.application.class.parent_name.underscore.dasherize
#   BONSAI_INDEX_NAME = "#{app_name}-#{Rails.env}"
# end