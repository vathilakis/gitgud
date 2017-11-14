defmodule GitGud.Web.PageController do
  @moduledoc """
  Module responsible for handling CRUD repository requests.
  """

  use GitGud.Web, :controller

  @doc """
  Returns a SPA frontend application page.
  """
  @spec index(Plug.t, map) :: Plug.t
  def index(conn, _params) do
    render(conn, "index.html")
  end
end
