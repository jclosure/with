class Notifier < ActionMailer::Base
  default from: "webmaster@noolog.com"
  def test_message
    
    mail( :subject => "Message via Gmail",
          :to => "jclosure@gmail.com",
          :from => "webmaster@noolog.com",
          :sent_on => Time.now)
  end
end
