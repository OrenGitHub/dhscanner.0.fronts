<?php

use PhpParser\Error;
use PhpParser\NodeDumper;
use PhpParser\ParserFactory;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use Illuminate\Support\Str;
use Illuminate\View\Factory;
use Illuminate\View\FileViewFinder;
use Illuminate\Filesystem\Filesystem;
use Illuminate\View\Engines\CompilerEngine;
use Illuminate\View\Compilers\BladeCompiler;

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

Route::post('/to/php/code', function (Request $request) {

    $file = $request->file('source');
    if (!$file) { return "ERROR"; }

    $content = file_get_contents($file);
    $filesystem = new Filesystem();
    $filename = sys_get_temp_dir() . '/input_' . uniqid() . '.blade.php';
    $fl = fopen($filename, 'w');
    fwrite($fl, $content);
    fclose($fl);
    $compiler = new BladeCompiler($filesystem, sys_get_temp_dir());
    $properPhpCode = $compiler->compile($filename);
    unlink($filename);
    return $properPhpCode;
});
