<?php
include __DIR__ . '/../include/content.php';

function saveComment($file) {
    if (isset($_POST['comment'])) {
        $content = [];
        if (file_exists($file)) {
            $content = file_get_contents($file);
            $content = json_decode($content, true);
            if ($content === false) {
                $content = [];
            }
        }

        $newContent = json_decode($_POST['comment']);
        if (isset($_POST['comment']) && trim($_POST['comment'])) {
            $content[time()] = $_POST['comment'];
        } else {
            return false;
        }

        $content = json_encode($content, JSON_PRETTY_PRINT);
        if ($content !== false) {
            if (file_put_contents($file, $content)) {
                return true;
            }
        }
    }
    return false;
}

if (saveComment(__DIR__ . '/content.json')) {
    header('Location: example.php?status=success');
} else {
    header('Location: example.php?status=failed');
}
