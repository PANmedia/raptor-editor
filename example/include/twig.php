<?php
require_once __DIR__ . '/../../vendor/autoload.php';

function renderTwig($snippet, $data) {
    static $twig;
    if (!isset($twig)) {
        $twig = new \Twig_Environment(new \Twig_Loader_String());
    }
    return $twig->render((string) $snippet, $data);
}