require "json"

class TranslatorController < ApplicationController

  def healthcheck

    render plain: JSON.dump({ "healthy": true })

  end

  def post_handler

    # get the sent file entity
    source = params["source"]

    # read ruby source code
    file = File.open(source.tempfile)
    content = file.read
    file.close

    require "syntax_tree"

    # parse it
    program = SyntaxTree.parse(content)

    # return AST (json format)
    render plain: JSON.dump(program)

  end

end