<?php
require_once __DIR__ . '/functions.php';

$result = [];

$scan = function($path) use(&$result) {
    // echo 'Scanning: ' . $path . PHP_EOL;
    foreach (glob_recursive($path) as $file) {
        // echo 'Found: ' . $file . PHP_EOL;
        $contents = file_get_contents($file);
        $matches = null;
        preg_match_all('/^function (.+?)\(/m', $contents, $matches);
        foreach ($matches[1] as $function) {
	        $result[] = "if (typeof Raptor.$function === 'undefined' && typeof $function !== 'undefined') Raptor.$function = $function;";
        }
    }
};

$scan(__DIR__ . '/../src/tools/*.js');
$scan(__DIR__ . '/../src/adapters/*.js');
$scan(__DIR__ . '/../src/components/*.js');
$scan(__DIR__ . '/../src/tools/*.js');
$scan(__DIR__ . '/../../raptor-common/*.js');

$result = array_unique($result);

natsort($result);

$result = implode(PHP_EOL, $result);
echo "// <expose>
$result
window.Raptor = Raptor;
// </expose>
";
