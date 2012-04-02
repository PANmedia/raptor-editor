<?php
$opts  = 'b:';  // Required value
$opts .= 'l:';
$opts .= 'n:';
$opts .= 'r::';
$opts .= 'm::';

$options = getopt($opts);

if (!isset($options['b'])) {
    echo 'Base directory (-b /some/directory) is required'.PHP_EOL; 
    die();
}
if (!isset($options['l'])) {
    echo 'Locale name (-l zh_CN) is required'.PHP_EOL; 
    die();
}
if (!isset($options['n'])) {
    echo 'Locale native name (-n 简体中文) is required'.PHP_EOL; 
    die();
}
$base_directory = rtrim($options['b'], '/').'/';
$locale = $options['l'];
$locale_name = $options['n'];
$replace = isset($options['r']) ? true : false;
$merge = isset($options['m']) ? true : false;

if ($replace && $merge) {
    echo 'Choose to replace OR merge an existing file, not both';
    die();
}

$strings = array();

$xgettext_extract = function($directory, $strings, $process_all = false) use (&$xgettext_extract) {
    $directory_handle = opendir($directory);
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
                        if(!$skipping && preg_match_all("/_\('(.*)'[,)]/iU", $line, $result)) {
                            foreach($result[1] as $string) {
                                $strings[$string] = $string;
                            }
                        }
                    }
                }
            }
            else if(is_dir($directory.$file) && $file != '.git') {
                $strings = $xgettext_extract($directory.$file.'/', $strings, $file == 'templates');
            }
        }
    }
    closedir($directory_handle);
    return $strings;
};

$strings = $xgettext_extract($base_directory, $strings);

$locale_file = dirname(__FILE__).'/locales/'.$locale.'.js';

if ((!$replace && !$merge) && file_exists($locale_file)) {
    echo $locale_file.' exists - to replace it use -r, to merge use -m'.PHP_EOL;
    die();
}

$write = function($locale_file, $strings) use ($locale, $locale_name) {
    $output = array();
    $tab = '    ';
    $head = "$.ui.editor.registerLocale('$locale', '$locale_name', {\n";
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
};

if ($replace || (!$replace && !$merge)) {
    $write($locale_file, $strings);
} else {
    $lines = file($locale_file);
    foreach($lines as $line) {
        $result= null; 
        if(preg_match('/^\s*"(.+)":\s?"(.+)",?$/iU', $line, $result)) {
            $key = $result[1];
            $value = $result[2];
            if (isset($strings[$key]) && $strings[$key] != $value) {
                $strings[$key] = $value;
            }
        }
    }
    $write($locale_file, $strings);
} 
