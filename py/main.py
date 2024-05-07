from flask import Flask
from flask import request

import subprocess

from typing import Final

app = Flask(__name__)

@app.route('/healthcheck', methods=['GET'])
def healthcheck():
    return { 'healthy': True }

@app.route('/to/native/py/ast', methods=['POST'])
def parse():
    fl = request.files['source']
    python_source_code = fl.read()
    tree = parse(python_source_code)
    return ast.dump(tree, include_attributes=True)