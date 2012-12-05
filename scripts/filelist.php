<?php

function glob_recursive($pattern, $flags = 0) {
    $files = glob($pattern, $flags);

    foreach (glob(dirname($pattern) . '/*', GLOB_ONLYDIR | GLOB_NOSORT) as $dir) {
        $files = array_merge($files, glob_recursive($dir . '/' . basename($pattern), $flags));
    }

    return $files;
}

$files = array();
usort($files, function($a, $b) {
    $ap = explode('\\', $a);
    $bp = explode('\\', $b);
    if (sizeof($ap) > sizeof($bp)) {
        return 1;
    } elseif (sizeof($ap) < sizeof($bp)) {
        return -1;
    }
    $i = 0;
    while (strcmp($ap[$i], $bp[$i]) === 0) {
        $i++;
    }
    return strcmp($ap[$i], $bp[$i]);
});

//$files = glob_recursive(__DIR__ . '/../src/*.js');
//foreach ($files as $i => $file) {
//    $files[$i] = trim(substr(realpath($file), strlen(realpath(__DIR__ . '/../src'))), DIRECTORY_SEPARATOR);
//    $files[$i] = str_replace('\\', '/', $files[$i]);
//}
//echo implode(PHP_EOL, $files);
//
//$files = glob_recursive(__DIR__ . '/../src/*.css');
//foreach ($files as $i => $file) {
//    $files[$i] = trim(substr(realpath($file), strlen(realpath(__DIR__ . '/../src'))), DIRECTORY_SEPARATOR);
//    $files[$i] = str_replace('\\', '/', $files[$i]);
//}
//echo implode(PHP_EOL, $files);
//
//$files = glob_recursive(__DIR__ . '/../src/*.png');
//foreach ($files as $i => $file) {
//    $files[$i] = trim(substr(realpath($file), strlen(realpath(__DIR__ . '/../src'))), DIRECTORY_SEPARATOR);
//    $files[$i] = str_replace('\\', '/', $files[$i]);
//}
//echo implode(PHP_EOL, $files);

$files = glob_recursive(__DIR__ . '/../src/*.html');
foreach ($files as $i => $file) {
    $files[$i] = trim(substr(realpath($file), strlen(realpath(__DIR__ . '/../src'))), DIRECTORY_SEPARATOR);
    $files[$i] = str_replace('\\', '/', $files[$i]);
}
echo implode(PHP_EOL, $files);
