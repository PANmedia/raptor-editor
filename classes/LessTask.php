<?php
class LessTask extends Task {

    private $filesets = array();

    public function main() {
        require_once $this->project->getBasedir() . '/dependencies/lessc.inc.php';
        foreach($this->filesets as $fs) {
            try {
                $files = $fs->getDirectoryScanner($this->project)->getIncludedFiles();
                foreach ($files as $file) {
                    lessc::ccompile($file, $file . '.css');
                }
            } catch (BuildException $be) {
                $this->log($be->getMessage(), Project::MSG_WARN);
            }
        }
    }

    public function createFileSet() {
        $num = array_push($this->filesets, new FileSet());
        return $this->filesets[$num-1];
    }
}
