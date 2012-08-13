<?php
$opts  = 'b:';  // Required value
$opts .= 'l:';
$opts .= 'n:';
$opts .= 'r::';
$opts .= 'm::';

$options = getopt($opts);

if (!isset($options['b'])) {
    die('Base directory (-b /some/directory) is required'.PHP_EOL);
}
if (!isset($options['l'])) {
    die('Locale name (-l zh_CN) is required'.PHP_EOL);
}
if (!isset($options['n'])) {
    die('Locale native name (-n 简体中文) is required'.PHP_EOL);
}

$base_directory = rtrim($options['b'], '/').'/';
$locale = $options['l'];
$locale_name = $options['n'];
$replace = isset($options['r']) ? true : false;
$merge = isset($options['m']) ? true : false;

if ($replace && $merge) {
    die('Choose to replace OR merge an existing file, not both');
}

/* FUNCTIONS */
function xgettext_extract($directory, $strings, $process_all = false) {
    $directory_handle = opendir($directory);
    if (preg_match('/plugins\-extra/', $directory)) {
        return $strings;
    }
    while (false !== ($file = readdir($directory_handle))) {
        if ($file != "." && $file != "..") {
            if (is_file($directory.$file)) {
                if ($process_all || (strpos($file, 'jquery.ui.editor') !== false) && in_array(pathinfo($file, PATHINFO_EXTENSION), array('js', 'html'))) {
                    echo "Extracting from $directory$file\n";
                    $skipping = false;
                    foreach(file($directory.$file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
                        $result = null;
                        if (strpos($line, '<strict>') !== false || strpos($line, '<debug>') !== false) $skipping = true;
                        if (strpos($line, '</strict>') !== false || strpos($line, '</debug>') !== false) $skipping = false;
                        if(!$skipping && preg_match_all("/_\(['\"]{1}(.*)['\"]{1}[,)]/iU", $line, $result)) {
                            foreach($result[1] as $string) {
                                $strings[$string] = $string;
                            }
                        }
                    }
                }
            }
            else if(is_dir($directory.$file) && $file != '.git') {
                $strings = xgettext_extract($directory.$file.'/', $strings, $file == 'templates');
            }
        }
    }
    closedir($directory_handle);
    return $strings;
}

/**
 * Write locale data to file
 * @param  {string}  $locale_file Full path to file data should be written to.
 * @param  {string[]}  $strings Array of strings to be written.
 * @param  {string}  $locale Name of the locale, e.g. 'en'
 * @param  {string} $locale_name Native locale name, e.g. 'English'
 * @param  {string|null} $headerBlock Comment block to include at the top of the file.
 */
function writeLocale($locale_file, $strings, $locale, $locale_name, $headerBlock = false) {
    $headerBlock = $headerBlock ?: '/**
 * @fileOverview {language} strings file.
 * @author {name}, {email}, {link}
 */
';
    $output = [];
    $tab = '    ';
    $head = "{$headerBlock}registerLocale('$locale', '$locale_name', {\n";
    $tail = "\n});\n";
    ksort($strings);

    $locale_handle = fopen($locale_file, 'w');

    fwrite($locale_handle, $head);

    foreach ($strings as $key => $value) {
        $output[] = $tab.'"'.str_replace('"', '\"', $key).'": "'.str_replace('"', '\"', $value).'"';
    }

    fwrite($locale_handle, implode(",\n", $output));
    fwrite($locale_handle, $tail);
    fclose($locale_handle);
}

/* BEGIN EXTRACTION */
$strings = xgettext_extract($base_directory, []);

$locale_file = dirname(__FILE__).'/locales/'.$locale.'.js';

if ((!$replace && !$merge) && file_exists($locale_file)) {
    die($locale_file.' exists - to replace it use -r, to merge use -m'.PHP_EOL);
}

/* WRITE TO FILE */
if ($replace || (!$replace && !$merge)) {
    writeLocale($locale_file, $strings, $locale, $localeName);
} else {
    $headerBlock = '';
    $headerCaptured = false;
    $lines = file($locale_file);
    foreach($lines as $line) {
        if (!$headerCaptured && preg_match('@^(\s\*|/)@', $line)) {
            $headerBlock .= $line;
            continue;
        }
        $result= null;
        if(preg_match('/^\s*"(.+)":\s?"(.+)",?$/iU', $line, $result)) {
            $headerCaptured = true;
            $key = $result[1];
            $value = $result[2];
            if (isset($strings[$key]) && $strings[$key] != $value) {
                $strings[$key] = $value;
            }
        }
    }
    writeLocale($locale_file, $strings, $locale, $locale_name, $headerBlock);
}
