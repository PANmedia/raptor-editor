<?php
require_once __DIR__ . '/functions.php';
if (!isset($_SERVER['argv'][1]) || !is_dir($_SERVER['argv'][1])) {
    echo 'Usage: php scripts/' . __FILE__ . ' <directory>';
    exit;
}
$directory = $_SERVER['argv'][1];

$result = [];
$files = glob_recursive($directory . '/*.*');
foreach ($files as $i => $file) {
    if (preg_match('/\.js$/', $file)) {
        $contents = file_get_contents($file);
        if (preg_match("/^\s+name:\s'(.*)'/m", $contents, $matches)) {
            $result[] = $matches[1];
        } else {
        }
    }
}

sort($result);
echo implode(PHP_EOL, $result);
