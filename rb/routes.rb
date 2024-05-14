Rails.application.routes.draw do

  get  "/healthcheck", to: "translator#healthcheck"
  post "/to/native/cruby/ast", to: "translator#post_handler"

end