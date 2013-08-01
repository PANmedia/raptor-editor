<?php
function loadContent($file) {
    $content = [];
    if (file_exists($file)) {
        $content = file_get_contents($file);
        $content = json_decode($content, true);
        if ($content === false) {
            $content = [];
        }
    }
    return $content;
}
