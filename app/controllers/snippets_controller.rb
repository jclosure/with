class SnippetsController < ApplicationController
  
 ## solr setup
 # def search
 #    search=Snippet.solr_search do
 #      fulltext params[:query]
 #    end
 #    @snippets = search.results
 #    #@snippets = Snippet.all
 #    respond_to do |format|
 #      format.html { render :index }
 #      format.json { render json: @snippets }
 #    end
 #  end

 ## tire setup
 def search
    @searching = true;
    
    if (params[:user].present?)
      @user = User.where(email: params[:user]).first
      unless @user
        @snippets = []
      end
      params[:user_id] = @user.id if @user
    # elsif (user_signed_in?)
    #   params[:user_id] = current_user.id
    end
    @snippets = @snippets || Snippet.search(params)
    respond_to do |format|
      format.html { render :index }
      format.json { render json: @snippets }
    end
  end
 
  
  # GET /snippets
  # GET /snippets.json
  def index
    ## per user
    if (user_signed_in?)
      @user = current_user
      @snippets = @user.snippets
    else
    ## all
      @snippets = Snippet.all
    end

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @snippets }
    end
  end

  # GET /snippets/1
  # GET /snippets/1.json
  def show
    @snippet = Snippet.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @snippet }
    end
  end

  # GET /snippets/new
  # GET /snippets/new.json
  def new
    @snippet = Snippet.new
    
    @snippet.source_url = params[:source] || "source url not sent"
    
    #@user = User.first #todo: complete this.

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @snippet }
    end
  end

  # GET /snippets/1/edit
  def edit
    @snippet = Snippet.find(params[:id])
    @user = User.first
  end

  # POST /snippets
  # POST /snippets.json
  def create
    @snippet = Snippet.new(params[:snippet])
    @snippet.text = ActionView::Base.full_sanitizer.sanitize(@snippet.content)
    ## per user
    # @user = User.where(:email => current_user.email)
    # @snippet.user = @user

    ## hack to assoc with first (maybe use an annon user for this)
    if (user_signed_in?)
      @user = User.where(email: current_user.email).first
      @user.snippets.push(@snippet)
    end
      
    respond_to do |format|
      if @snippet.save
        format.html { redirect_to @snippet, notice: 'Snippet was successfully created.' }
        format.json { render json: @snippet, status: :created, location: @snippet }
      else
        format.html { render action: "new" }
        format.json { render json: @snippet.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /snippets/1
  # PUT /snippets/1.json
  def update
    @snippet = Snippet.find(params[:id])

    respond_to do |format|
      if @snippet.update_attributes(params[:snippet])
        @snippet.text = ActionView::Base.full_sanitizer.sanitize(@snippet.content)
        format.html { redirect_to @snippet, notice: 'Snippet was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @snippet.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /snippets/1
  # DELETE /snippets/1.json
  def destroy
    @snippet = Snippet.find(params[:id])
    @snippet.destroy

    respond_to do |format|
      format.html { redirect_to snippets_url }
      format.json { head :no_content }
    end
  end
end
