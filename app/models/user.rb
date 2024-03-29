class User
  include Mongoid::Document
  include Mongo::Voter
  
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable
  devise :omniauthable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
         #,:token_authenticatable

  ## Database authenticatable
  field :email,              :type => String, :default => ""
  field :encrypted_password, :type => String, :default => ""

  ## Recoverable
  field :reset_password_token,   :type => String
  field :reset_password_sent_at, :type => Time

  ## Rememberable
  field :remember_created_at, :type => Time

  ## Trackable
  field :sign_in_count,      :type => Integer, :default => 0
  field :current_sign_in_at, :type => Time
  field :last_sign_in_at,    :type => Time
  field :current_sign_in_ip, :type => String
  field :last_sign_in_ip,    :type => String

  field :name, :type => String
  field :uid, :type => String
  field :provider, :type => String

  validates_presence_of :name, :email
  validates_uniqueness_of :email, :case_sensitive => false
  attr_accessible :name, :email, :password, :password_confirmation, :remember_me, :provider, :uid, :authentication_token, :remember_me

  has_many :snippets, :class_name => "Snippet", :inverse_of => :user, :validate => false

  ## Encryptable
  # field :password_salt, :type => String

  ## Confirmable
  # field :confirmation_token,   :type => String
  # field :confirmed_at,         :type => Time
  # field :confirmation_sent_at, :type => Time
  # field :unconfirmed_email,    :type => String # Only if using reconfirmable

  ## Lockable
  # field :failed_attempts, :type => Integer, :default => 0 # Only if lock strategy is :failed_attempts
  # field :unlock_token,    :type => String # Only if unlock strategy is :email or :both
  # field :locked_at,       :type => Time

  ## Token authenticatable
  field :authentication_token, :type => String




  def self.find_for_facebook_oauth(auth, signed_in_resource=nil)
    #p auth.to_yaml
    user = User.where(:email => auth.info.email).first

    unless user
      p "creating new User"
      user = User.create!(name:auth.extra.raw_info.name,
                           provider:auth.provider,
                           uid:auth.uid,
                           email:auth.info.email,
                           password:Devise.friendly_token[0,20]
                           )
      p "created new User with _id=" + user._id
    end
    user.authentication_token = auth.credentials.token
    user.save!
    user
  end


  def send_instructions
    Notifier.instructions(self).deliver
  end

  def fb_profile
    @profile ||= FbGraph::User.me(self.uid).fetch
  end

end
