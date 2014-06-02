<?php
require_once __DIR__ . '/functions.php';
if (!isset($_SERVER['argv'][1]) || !is_dir($_SERVER['argv'][1])) {
    echo 'Usage: php scripts\list-files.php <directory>';
    exit;
}
$directory = $_SERVER['argv'][1];

$files = glob_recursive($directory . '/*.*');
foreach ($files as $i => $file) {
    $files[$i] = realpath($file);
}

usort($files, function($a, $b) {
    if (dirname($a) != dirname($b)) {
        return strcmp(dirname($a), dirname($b));
    }
    $ae = substr($a, strpos($a, '.') + 1);
    $be = substr($b, strpos($b, '.') + 1);
    if ($ae === $be) {
        return strcmp($a, $b);
    }
    return strcmp($ae, $be);
});

$root = realpath(__DIR__ . '/..') . '/';
$last_path = null;
foreach ($files as $i => $file) {
    if ($last_path === null) {
        $last_path = dirname($file);
    } elseif ($last_path !== dirname($file) && !preg_match('/[\/\\\\]templates[\/\\\\]/', $file)) {
        echo PHP_EOL;
        $last_path = dirname($file);
    }
    $file = substr($file, strlen($root));
    $file = str_replace('\\', '/', $file);
    echo $file . PHP_EOL;
}
