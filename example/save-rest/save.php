<?php
if (isset($_POST['id']) && isset($_POST['content'])) {
    $file = __DIR__ . '/content.json';
    $content = [];
    if (file_exists(__DIR__ . '/content.json')) {
        $content = file_get_contents($file);
        $content = json_decode($content, true);
        if ($content === false) {
            $content = [];
        }
    }
    $content[$_POST['id']] = $_POST['content'];
    $content = json_encode($content, JSON_PRETTY_PRINT);
    if ($content !== false) {
        if (file_put_contents($file, $content)) {
            echo json_encode(true);
            return;
        }
    }
}
echo json_encode(false);
