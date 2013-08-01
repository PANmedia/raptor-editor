<?php
namespace Raptor;
use LogicException;

class Example {

    public $name;
    public $baseUri;
    public $content;

    public function __construct($name, $baseUri) {
        $this->name = $name;
        $this->baseUri = $baseUri;
    }

    public function loadContent($file) {
        $this->content = [];
        if (file_exists($file)) {
            $this->content = file_get_contents($file);
            $this->content = json_decode($this->content, true);
            if ($this->content === false) {
                $this->content = [];
            }
        }
        return $this->content;
    }

    public function renderHead() {
        $baseUri = $this->baseUri;
        ob_start();
        include ROOT . '/example/include/head.php';
        return ob_get_clean();
    }

    public function renderContent($section, $buffer = null) {
        if (isset($this->content[$section])) {
            return $this->content[$section];
        }
        return $buffer;
    }

    public function renderNavigation() {
        $baseUri = $this->baseUri;
        ob_start();
        include ROOT . '/example/include/nav.php';
        return ob_get_clean();
    }

}
