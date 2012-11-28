class Notifier < ActionMailer::Base
  default :from => 'noreply@company.com'
 
  def instructions(user)
    @user = user
    #@confirmation_url = confirmation_url(user)
    mail :to => @user.email, :subject => 'Instructions'
  end

end
