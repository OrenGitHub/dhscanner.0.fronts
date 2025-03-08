import ast
import logging
import fastapi

app = fastapi.FastAPI()

class ReplaceQuotes(ast.NodeTransformer):
    def visit_Constant(self, node: ast.Constant) -> ast.Constant:
        if isinstance(node.value, str):
            node.value = node.value.replace('\'', '')
            node.value = node.value.replace('"', '')
        return node

@app.get('/healthcheck')
def healthcheck():
    return { 'healthy': True }

@app.post('/to/native/py/ast')
async def parse(source: fastapi.UploadFile = fastapi.File(...)):
    content = await source.read()
    python_source_code = content.decode()
    logging.info(python_source_code)
    original_tree = ast.parse(python_source_code)
    normalized_tree = ReplaceQuotes().visit(original_tree)
    result = ast.dump(normalized_tree, include_attributes=True)
    return fastapi.Response(content=result, media_type="text/plain")
