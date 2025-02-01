<?php

use PhpParser\Error;
use PhpParser\NodeDumper;
use PhpParser\ParserFactory;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/csrf_token', function() { return csrf_token(); });

Route::post('/to/php/ast', function (Request $request) {

    $file = $request->file('source');
    if (!$file) { return "ERROR"; }

    $code = file_get_contents($file);
    $parser = (new ParserFactory())->createForNewestSupportedVersion();

    try { $ast = $parser->parse($code); }
    catch (Error $error) { return "ERROR"; }

    $dumper = new NodeDumper(['dumpPositions' => true]);
    return $dumper->dump($ast, $code) . "\n";
});
