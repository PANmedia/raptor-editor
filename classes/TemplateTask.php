<?php
class TemplateTask extends Task {

    private $filesets = array();
    private $name = null;

    public function main() {
        $result = [];
        foreach (file($this->file) as $file) {
            $file = trim($file);
            if (!$file) {
                continue;
            }
            if (pathinfo($file, PATHINFO_EXTENSION) === 'html') {
                preg_match('/plugins[\/\\\\]{1}(.*?)[\/\\\\]{1}templates[\/\\\\]{1}(.*?)\\.html/i', $file, $preg);

                if (isset($preg[1]) && isset($preg[2])) {
                    $name = $preg[1] . '.' . $preg[2];
                } else {
                    $name = substr(basename($file), 0, -5);
                }

                $content = json_encode(file_get_contents($this->buildDir . '/src/' . $file));
                $result[] = "'$name': $content";
            }
        }
        
        $result = implode(',' . PHP_EOL, $result);
        
        foreach (file($this->file) as $file) {
            $file = trim($file);
            if (!$file) {
                continue;
            }
            if (pathinfo($file, PATHINFO_EXTENSION) === 'js') {
                $content = file_get_contents($this->buildDir . '/src/' . $file);
                $position = strpos($content, '/* <templates/> */');
                if ($position !== false) {
                    $this->log($file, Project::MSG_INFO);
                    $content = str_replace('/* <templates/> */', $result, $content);
                    file_put_contents($this->buildDir . '/src/' . $file, $content);
                }
            }
        }
    }

    public function setFile($file) {
        $this->file = $file;
    }

    public function setBuildDir($buildDir) {
        $this->buildDir = $buildDir;
    }

}
