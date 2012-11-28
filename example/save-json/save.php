<?php
var_dump($_POST);
if (isset($_POST['raptor-content'])) {
    $content = json_decode($_POST['raptor-content']);
    if ($content) {
        var_dump($content);
    }
}
echo json_encode(false);
