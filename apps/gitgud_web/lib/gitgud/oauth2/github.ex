defmodule GitGud.OAuth2.GitHub do
  @moduledoc """
  An *OAuth2.0* authentication strategy for GitHub.
  """
  use OAuth2.Strategy

  @doc """
  Returns an *OAuth2.0* client.
  """
  @spec client() :: OAuth2.Client.t
  def client do
    Application.fetch_env!(:gitgud_web, __MODULE__)
    |> Keyword.merge(config())
    |> OAuth2.Client.new()
  end

  @doc """
  Returns the *OAuth2.0* authorize URL.
  """
  @spec authorize_url!(keyword) :: binary
  def authorize_url!(params \\ []) do
    OAuth2.Client.authorize_url!(client(), params)
  end

  @doc """
  Fetches an *OAuth2.0* access token.
  """
  @spec get_token!(keyword, list) :: OAuth2.Client.t
  def get_token!(params \\ [], headers \\ []) do
    OAuth2.Client.get_token!(client(), Keyword.merge(params, client_secret: client().client_secret), headers)
  end

  #
  # Callbacks
  #

  @impl true
  def authorize_url(client, params) do
    OAuth2.Strategy.AuthCode.authorize_url(client, params)
  end

  @impl true
  def get_token(client, params, headers) do
    client
    |> put_header("Accept", "application/json")
    |> OAuth2.Strategy.AuthCode.get_token(params, headers)
  end

  #
  # Helpers
  #

  defp config do
    [strategy: __MODULE__,
     site: "https://api.github.com",
     authorize_url: "https://github.com/login/oauth/authorize",
     token_url: "https://github.com/login/oauth/access_token"]
  end
end
