#Tire::Configuration.url "http://c7ji5kc:jvzsl54de3fqnu8v@jasmine-1709588.us-east-1.bonsai.io"
#Tire::Configuration.url "http://localhost:9200"

ENV['ELASTICSEARCH_URL'] = ENV['BONSAI_URL']

if ENV['BONSAI_URL']
  Tire.configure do
    url ENV['BONSAI_URL']
  end
end

app_name = Rails.application.class.parent_name.underscore.dasherize
ENV['BONSAI_INDEX_NAME'] = "#{app_name}-#{Rails.env}"
