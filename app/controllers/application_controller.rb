class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :authenticate_user!, :authenticate, :load_today_post
  after_filter :set_flash_values
  helper_method :current_user
  def home
    @recent_posts = @user.posts.recent_posts if @user
    @flash_notice = "nothing"
    puts "~~~~~~2~~~~~~~~~~~~~~~~~~`#{@flash_notice}"
  end

  def list_posts
    search_text = params[:search_text]
    @matched_posts = @user.posts.where("LOWER(entry_text) like '%#{search_text.downcase}%'")
    # posts  = @user.posts.collect{|qwe| qwe.entry_date if qwe.entry_text.downcase.include?(text)}
    # render :json => {:text => posts.compact}, :status => 200
    render :partial => "shared/list_post", :locals => { :posts => @matched_posts}
  end

  def get_post
    @post = @user.posts.where("entry_date = ?",params[:date]).first || @user.posts.new(:entry_date => params[:date])
    render :json => {:entry_text => @post.entry_text, :entry_date => @post.entry_date }, :status => 200
  end  
    
  def save_post
	if @post
		@post.entry_text = params[:entry_text]
  	else
  		@post = @user.posts.new(:entry_text => params[:entry_text], :entry_date => Date.today)
  	end
  	if @post.save
  		render :text => "Saved Successfully."
  	else
  		render :text => "Problem saving data."
  	end
  end

  def set_flash_values
    @flash_error = flash[:error]
    @flash_notice = flash[:notice]
    puts "~~~~~~~~1~~~~~~~~~~~~~~~~`#{@flash_notice}"
  end
  private
  def authenticate
  	@user = user_signed_in? ? current_user : nil
  end

  def load_today_post
  	@post = @user.post_on if @user
  end
end
