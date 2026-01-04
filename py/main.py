import ast
import sys
import logging
import fastapi
import urllib.parse
from fastapi import status

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(message)s",
    datefmt="%d/%m/%Y ( %H:%M:%S )",
    stream=sys.stdout,
    force=True
)

app = fastapi.FastAPI()

class ReplaceQuotes(ast.NodeTransformer):
    def visit_Constant(self, node: ast.Constant) -> ast.Constant:
        if isinstance(node.value, str):
            node.value = node.value.replace('\'', '')
            node.value = node.value.replace('"', '')
        return node

def validated_source(source: fastapi.UploadFile = fastapi.File(...)) -> fastapi.UploadFile:
    if source.filename is None:
        raise fastapi.HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is required in the file upload"
        )
    return source

@app.get('/healthcheck')
def healthcheck():
    return { 'healthy': True }

@app.post('/to/native/py/ast')
async def parse(source: fastapi.UploadFile = fastapi.Depends(validated_source)):
    decoded_filename = urllib.parse.unquote(source.filename)
    logging.info(f'POST {decoded_filename}')
    content = await source.read()
    python_source_code = content.decode()
    original_tree = ast.parse(python_source_code)
    normalized_tree = ReplaceQuotes().visit(original_tree)
    result = ast.dump(normalized_tree, include_attributes=True)
    return fastapi.Response(content=result, media_type="text/plain")
