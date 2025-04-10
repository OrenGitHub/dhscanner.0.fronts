FROM ruby
RUN apt-get update
RUN apt-get install vim -y
RUN echo "set number" > ~/.vimrc
RUN echo "set incsearch" >> ~/.vimrc
RUN gem install rails
RUN rails new translator --api --skip-action-mailer --skip-active-record
WORKDIR translator
RUN gem install syntax_tree
COPY routes.rb config
COPY translator_controller.rb app/controllers
COPY development.rb config/environments
COPY production.rb config/environments
COPY Gemfile Gemfile
EXPOSE 3000
CMD [ "rails", "server", "-b", "0.0.0.0" ]