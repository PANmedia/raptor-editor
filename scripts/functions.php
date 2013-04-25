<?php
function glob_recursive($pattern, $flags = 0) {
    $files = glob($pattern, $flags);

    foreach (glob(dirname($pattern) . '/*', GLOB_ONLYDIR | GLOB_NOSORT) as $dir) {
        $files = array_merge($files, glob_recursive($dir . '/' . basename($pattern), $flags));
    }

    return $files;
}

function loose_decode($s) {
    $s = str_replace('"', '\"', $s);
    $s = str_replace('\'', '"', $s);
    $s = preg_replace('/"\s*\+\s*"/i', '', $s);
    $s = preg_replace('/^\s+(\w+):/im', '"\1":', $s);
    return json_decode($s);
}
