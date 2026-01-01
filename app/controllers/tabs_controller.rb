class TabsController < ApplicationController
  def show
    @tab = Tab.includes(:tuning, song: :artist).find_by_slug!(params[:slug])
    @tab.increment_views!
  end
end
