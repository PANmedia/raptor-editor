<?php
require_once __DIR__ . '/functions.php';

if (!isset($_SERVER['argv'][1]) || !is_file($_SERVER['argv'][1])) {
    echo 'Usage: php scripts\convert-bind.php <file>';
    exit;
}
$file = realpath($_SERVER['argv'][1]);
echo 'Reading: ' . $file . PHP_EOL;

$content = file_get_contents($file);
$offset = 0;
do {
    $pos = strpos($content, '}.bind(this)', $offset);
    $offset = $pos + 1;
    if ($pos !== false) {
        $content = substr($content, 0, $pos + 1) . ', this)' . substr($content, $pos + strlen('}.bind(this)'));
        $i = $pos;
        $code = '';
        $braces = 0;
        do {
            $char = $content[$i--];
            if ($char == '}') {
                $braces++;
            }
            if ($char == '{') {
                $braces--;
            }
            $code = $char . $code;
        } while ($braces > 0);
        while ($char != '(') {
            $char = $content[$i--];
            $code = $char . $code;
        }
        while ($char != 'f') {
            $char = $content[$i--];
            $code = $char . $code;
        }
//        echo('-------------------------------------------' . PHP_EOL);
//        echo $code . PHP_EOL;
//        die();
        $content = substr($content, 0, $i + 1) . '$.proxy(' . substr($content, $i + 1);
//        $pos + strlen('$.proxy(')
    }
} while ($pos !== false);
$content = preg_replace('/this\.([a-zA-Z0-9.]+)\.bind\(this\)/', '$.proxy(this.$1, this)', $content);
$content = preg_replace('/Raptor\.([a-zA-Z0-9.]+)\.bind\(Raptor\)/', '$.proxy(Raptor.$1, Raptor)', $content);
echo 'Writing: ' . $file . PHP_EOL;
file_put_contents($file, $content);
