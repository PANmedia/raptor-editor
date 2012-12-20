<?php
class CombineTask extends Task {

    private $file;
    private $buildDir;

    private function copyDirectory($source, $destination) {
        $directory = opendir($source);
        @mkdir($destination);
        while (false !== ($file = readdir($directory))) {
            if (($file != '.' ) && ( $file != '..')) {
                if (is_dir("{$source}/{$file}")) {
                    $this->copyDirectory("{$source}/{$file}", "{$destination}/{$file}");
                } else {
                    if (!file_exists("{$source}/{$file}")) {
                        throw new BuildException("Source file: {$source}/{$file} does not exist");
                    }
                    copy("{$source}/{$file}", "{$destination}/{$file}");
                }
            }
        }
        closedir($directory);
    }

    public function main() {
        $noConflict = false;
        $wrapper = false;

        $cssOutput = $this->buildDir . '/concat.css';
        $cssOutputHandle = fopen($cssOutput, 'w');
        ftruncate($cssOutputHandle, 0);

        $jsOutput = $this->buildDir . '/concat.js';
        $jsOutputHandle = fopen($jsOutput, 'w');
        ftruncate($jsOutputHandle, 0);
        foreach (file($this->file) as $file) {
            $file = trim($file);
            if (!$file) {
                continue;
            }
            if (preg_match('/^\(function\(/', $file)) {
                $this->log($file, Project::MSG_INFO);
                $data = "
                    /* Wrapper. */
                    $file
                ";
                fwrite($jsOutputHandle, $data);
                continue;
            } elseif (preg_match('/^}\)\(.*\);/', $file)) {
                $this->log($file, Project::MSG_INFO);
                $data = "
                    $file
                    /* End of wrapper. */
                ";
                fwrite($jsOutputHandle, $data);
                continue;
            }
            $file = $this->buildDir . '/' . $file;
            if (!is_file($file)) {
                die("Error processing file manifest: {$file}, does not exist.");
            }
            $this->log($file, Project::MSG_INFO);
            $data = file_get_contents($file);
            $data = "
                /* File: $file */
                $data
                /* End of file: $file */
            ";

            if (pathinfo($file, PATHINFO_EXTENSION) === 'css') {
                fwrite($cssOutputHandle, $data);
            } elseif (pathinfo($file, PATHINFO_EXTENSION) === 'js') {
                if (basename($file) === 'jquery.js' && $this->noConflict) {
                    $noConflict = true;
                    fwrite($jsOutputHandle, $this->getNoConflictTop());
                }
                fwrite($jsOutputHandle, $data);
            }
        }

        if ($noConflict) {
            fwrite($jsOutputHandle, $this->getNoConflictBottom());
        }

        fclose($cssOutputHandle);
        fclose($jsOutputHandle);
    }

    public function setFile($file) {
        $this->file = $file;
    }

    public function setBuildDir($buildDir) {
        $this->buildDir = $buildDir;
    }

    public function setWrapper($wrapper) {
        $this->wrapper = $wrapper;
    }

    public function setNoConflict($noConflict) {
        $this->noConflict = $noConflict;
    }

    public function setName($name) {
        $this->name = (string) $name;
    }

    public function getName() {
        return $this->name;
    }

    public function getNoConflictTop() {
        return "
            // No conflict wrapper
            (function(window, undefined) {
        ";
    }

    public function getNoConflictBottom() {
        return "
            // No conflict wrapper
            })( window );
            var jQuery = window.jQuery.noConflict(true);
            var $ = jQuery;
            window['raptor'] = jQuery;
        ";
    }

}
