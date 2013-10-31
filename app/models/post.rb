class Post < ActiveRecord::Base
  attr_accessible :entry_date, :entry_text, :user_id
  belongs_to :user
  scope :recent_posts, order(:entry_date).limit(10)
end
