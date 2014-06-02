<?php

$directory = new RecursiveDirectoryIterator(__DIR__ . '/../cases', RecursiveDirectoryIterator::SKIP_DOTS);
$filter = new RecursiveCallbackFilterIterator($directory, function($file) {
    return $file->isDir() || $file->getExtension() == 'php';
});
$iterator = new RecursiveIteratorIterator($filter);
foreach ($iterator as $file) {
    $html = escapeshellarg(substr($file, 0, -4) . '.html');
    $file = escapeshellarg($file);
    echo `php $file > $html` . PHP_EOL;
}