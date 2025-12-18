class TabsController < ApplicationController
  def show
    @tab = Tab.includes(:tuning, song: :artist).find(params[:id])
    @tab.increment_views!
  end
end


