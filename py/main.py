import ast

from flask import Flask
from flask import request

import subprocess

from typing import Final

app = Flask(__name__)

class ReplaceQuotes(ast.NodeTransformer):
    def visit_Constant(self, node: ast.Constant) -> ast.Constant:
        if isinstance(node.value, str):
            node.value = node.value.replace('\'', '')
            node.value = node.value.replace('"', '')
        return node

@app.route('/healthcheck', methods=['GET'])
def healthcheck():
    return { 'healthy': True }

@app.route('/to/native/py/ast', methods=['POST'])
def parse():
    fl = request.files['source']
    python_source_code = fl.read()
    original_tree = ast.parse(python_source_code)
    normalized_tree = ReplaceQuotes().visit(original_tree)
    return ast.dump(normalized_tree, include_attributes=True)
