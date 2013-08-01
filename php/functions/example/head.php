<?php
function head() {
    ob_start();
    include __DIR__ . '/head.php';
    return ob_get_clean();
}
