<?php
require_once __DIR__ . '/functions.php';

if (!isset($_SERVER['argv'][1])) {
    echo 'Usage: php scripts/locale.php <locale short name>' . PHP_EOL;
    echo 'Locales: ' . PHP_EOL;
    foreach (glob(__DIR__ . '/../src/locales/*.js') as $file) {
        echo ' - ' . substr(basename($file), 0, strpos(basename($file), '.')) . PHP_EOL;
    }
    return;
}
$locale = $_SERVER['argv'][1];
$file = __DIR__ . '/../src/locales/' . $locale . '.js';
if (!is_file($file)) {
    echo "Cannot file locale file: $file" . PHP_EOL;
    return;
}
$file = realpath($file);
$contents = file_get_contents($file);
preg_match("/registerLocale\(.*?, .*?, ({.*?})\);/s", $contents, $matches);
$locales = loose_decode($matches[1]);

$files = glob_recursive(__DIR__ . '/../src/*.*');
foreach ($files as $file) {
    $contents = file_get_contents($file);
    //preg_match_all("/_\('[a-z0-9]+'(, .*?)\)/is", $contents, $matches);
    $contents = preg_replace_callback("/_\('([a-z0-9]+)'(, .*?)?\)/is", function($matches) use($locales) {
        $string = $locales->{$matches[1]};
        $variables = '';
        if (isset($matches[2])) {
            $variables = $matches[2];
            preg_match_all('/[\'"]?([a-z0-9]+)[\'"]?:\s*(.*?)\s*(,|})/is', $variables, $variable_matches);
            foreach ($variable_matches[1] as $i => $key) {
                $replace = $variable_matches[2][$i];
                if (preg_match('/^[a-z0-9.]+$/i', $replace)) {
                    $replace = "' + {$variable_matches[2][$i]} + '";
                } else {
                    $replace = "' + ({$variable_matches[2][$i]}) + '";
                }
                $string = str_replace("{{{$key}}}", $replace, $string);
            }
        }
        $string = "'$string'";
        if (strpos($string, "'' + ") === 0) {
            $string = substr($string, 5);
        }
        if (strpos($string, " + ''") === 0) {
            $string = substr($string, 0, -5);
        }
        return $string;
    }, $contents);

    file_put_contents($file, $contents);
}
