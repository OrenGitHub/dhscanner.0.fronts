<?php
/**
 * Tiny HTTP front for dhscanner's PHP pipeline.
 *
 * Replaces the previous Laravel-based front: that one shipped the entire
 * `laravel/laravel` skeleton (HTTP kernel, session middleware, CSRF
 * verifier, routing layer, view layer, ...) just to expose a couple of
 * URLs. CSRF middleware in particular silently 419'd every POST the
 * workers sent, which was a recurring foot-gun.
 *
 * This file IS the entire HTTP surface, served by `php -S` (PHP's
 * built-in dev / single-tenant server -- fine for the in-cluster usage
 * pattern we have here):
 *
 *   GET  /healthcheck    -> 200 {"healthy": true}
 *   POST /to/php/ast     -> NodeDumper output of nikic/PhpParser
 *
 * `php -S` invokes this script for every incoming request. We dispatch
 * on (REQUEST_METHOD, URI path) and emit the body directly via `echo`.
 * Returning `true` (or simply not returning) tells the built-in server
 * that the request was handled; returning `false` would tell it to fall
 * back to static-file serving from the document root, which we never want.
 *
 * NOTE: the previous Laravel-based front also exposed `POST /to/php/code`
 * to preprocess `*.blade.php` templates (compile blade -> plain PHP, then
 * extract `<?php ... ?>` chunks). That endpoint and its `illuminate/view`
 * + `illuminate/filesystem` dependencies have been removed because the
 * current focus -- and the only PHP corpus we benchmark against
 * (`C:\Users\tuna_\GitHub\zabbix`) -- contains zero blade templates. When
 * a blade-heavy codebase becomes a real target, restoring the route is a
 * focused diff against THIS file plus its dependency manifest.
 */

require __DIR__ . '/vendor/autoload.php';

use PhpParser\Error;
use PhpParser\NodeDumper;
use PhpParser\ParserFactory;
use PhpParser\Node;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitorAbstract;

/**
 * Same string / inline-HTML normalization the previous Laravel front
 * applied. The downstream Haskell parser (dhscanner.1.parsers/PhpParser.y)
 * expects this exact shape, so the body is byte-equivalent to the
 * previous implementation; only the HTTP layer around it changed.
 */
final class StringNormalizer extends NodeVisitorAbstract
{
    public function enterNode(Node $node)
    {
        if (
            ($node instanceof Node\Scalar\String_) ||
            ($node instanceof Node\Scalar\EncapsedStringPart)
        ) {
            $raw = str_replace('"', '', $node->value);
            $one_liner = preg_replace('/\s+/', ' ', $raw);
            $node->value = '"' . $one_liner . '"';
        }
        if ($node instanceof Node\Stmt\InlineHTML) {
            $node->value = 'null';
        }
        return null;
    }
}

/**
 * Read the uploaded `source` file from a multipart POST.
 *
 * Returns the file's raw bytes on success, or null if either no file was
 * uploaded under the `source` field or the upload failed (PHP signals the
 * failure mode through `$_FILES['source']['error']`).
 */
function read_uploaded_source(): ?string
{
    if (!isset($_FILES['source'])) {
        return null;
    }
    $info = $_FILES['source'];
    if (!is_array($info) || ($info['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        return null;
    }
    $tmp = $info['tmp_name'] ?? '';
    if ($tmp === '' || !is_readable($tmp)) {
        return null;
    }
    $bytes = @file_get_contents($tmp);
    return $bytes === false ? null : $bytes;
}

function handle_healthcheck(): void
{
    header('Content-Type: application/json');
    echo json_encode(['healthy' => true]);
}

function handle_to_php_ast(): void
{
    $code = read_uploaded_source();
    if ($code === null) {
        // Match the previous Laravel front's sentinel exactly: the
        // workers + dhscanner.1.parsers loop both already special-case
        // a literal "ERROR" body as "front-side failure, drop this file".
        echo "ERROR";
        return;
    }

    $parser = (new ParserFactory())->createForNewestSupportedVersion();
    try {
        $ast = $parser->parse($code);
    } catch (Error $e) {
        echo "ERROR";
        return;
    }
    if ($ast === null) {
        echo "ERROR";
        return;
    }

    $traverser = new NodeTraverser();
    $traverser->addVisitor(new StringNormalizer());
    $ast = $traverser->traverse($ast);

    $dumper = new NodeDumper(['dumpPositions' => true]);
    echo $dumper->dump($ast, $code) . "\n";
}

function dispatch(): void
{
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';

    if ($method === 'GET' && $uri === '/healthcheck') {
        handle_healthcheck();
        return;
    }
    if ($method === 'POST' && $uri === '/to/php/ast') {
        handle_to_php_ast();
        return;
    }

    http_response_code(404);
    header('Content-Type: text/plain');
    echo "not found: {$method} {$uri}\n";
}

dispatch();
return true;
