<?php
$result = [];
foreach (glob(__DIR__ . '/src/tools/*.js') as $file) {
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
