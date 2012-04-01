<?php
class SortedFileSet extends Task {

    private $filesets = array();
    private $name = null;

    public function main() {
        foreach($this->filesets as $fs) {
            try {
                $files = $fs->getDirectoryScanner($this->project)->getIncludedFiles();
                sort($files);
                $this->project->setProperty($this->name, implode(',', $files));
            } catch (BuildException $be) {
                $this->log($be->getMessage(), Project::MSG_WARN);
            }
        }
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
