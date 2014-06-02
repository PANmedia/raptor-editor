<?php
require_once __DIR__ . '/functions.php';
$dirs = glob(__DIR__ . '/../src/plugins/*');
foreach ($dirs as $dir) {
    $files = glob_recursive($dir . '/*.*');
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
    $fileList = '';
    foreach ($files as $file) {
        if (basename($file) == 'build.js') continue;
        $fileList .= '        __dirname + \'' . substr($file, strlen($dir)) . '\',' . PHP_EOL;
    }
    $name = ucwords(str_replace('-', ' ', basename($dir)));
    $fielList = trim($fileList, PHP_EOL . ' ,');
$script = trim("
builder.addModule({
    name: '$name',
    type: 'plugin',
    files: [
        $fielList
    ]
});
");
    file_put_contents($dir . '/build.js', $script);
}