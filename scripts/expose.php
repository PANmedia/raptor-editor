<?php
require_once __DIR__ . '/glob.php';

$result = [];
foreach (glob_recursive(__DIR__ . '/../src/tools/*.js') as $file) {
    $contents = file_get_contents($file);
    $matches = null;
    preg_match_all('/^function (.+?)\(/m', $contents, $matches);
    foreach ($matches[1] as $function) {
        $result[] = "    $function: $function";
    }
}
sort($result);

foreach (glob_recursive(__DIR__ . '/../src/components/*.js') as $file) {
    $contents = file_get_contents($file);
    $matches = null;
    preg_match_all('/^function (.+?)\(/m', $contents, $matches);
    foreach ($matches[1] as $function) {
        $result[] = "    $function: $function";
    }
}
sort($result);

$result = implode(',' . PHP_EOL, $result);
echo "
$.extend($.ui.raptor, Raptor, {

    // <expose>
$result
    // </expose>

});
";
