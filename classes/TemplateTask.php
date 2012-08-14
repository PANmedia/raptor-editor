<?php
class TemplateTask extends Task {

    private $filesets = array();
    private $name = null;

    public function main() {
        $result = array();
        foreach($this->filesets as $fs) {
            try {
                $files = $fs->getDirectoryScanner($this->project)->getIncludedFiles();
                foreach ($files as $file) {
                    $preg = array();
                    //build[\/\\\\]{1}
                    preg_match('/plugins[\/\\\\]{1}(.*?)[\/\\\\]{1}templates[\/\\\\]{1}(.*?)\\.html/i', $file, $preg);

                    if (isset($preg[1]) && isset($preg[2])) {
                        $name = $preg[1] . '.' . $preg[2];
                    } else {
                        $name = substr(basename($file), 0, -5);
                    }

                    $content = json_encode(file_get_contents($file));
                    $result[] = "'$name': $content";
                }
            } catch (BuildException $be) {
                $this->log($be->getMessage(), Project::MSG_WARN);
            }
        }

        $this->project->setProperty($this->name, implode(',', $result));
    }

    public function createFileSet() {
        $num = array_push($this->filesets, new FileSet());
        return $this->filesets[$num-1];
    }

    public function setName($name) {
        $this->name = (string) $name;
    }

    public function getName() {
        return $this->name;
    }

}
