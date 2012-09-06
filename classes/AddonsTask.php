<?php
class AddonsTask extends Task {

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
        if (!$this->file) return;
        $phingFile = new PhingFile($this->buildDir);
        $buildDir = $phingFile->getAbsolutePath();
        $buildPluginsDir = "{$buildDir}/plugins/";
        if (!file_exists($buildPluginsDir)) {
            mkdir($buildPluginsDir);
        }

        foreach (file($this->file, FILE_SKIP_EMPTY_LINES) as $pluginEntry) {
            $addonDetails = explode('=', $pluginEntry);
            $addonDetails = array_filter($addonDetails);
            if (count($addonDetails) !== 2) {
                throw new BuildException("Error processing addon manifest: {$this->file}, one or more entries is malformed.");
                return;
            }
            // Copy the addon
            $pluginName = $addonDetails[0];
            $pluginDir = (new PhingFile(trim($addonDetails[1])))->getAbsolutePath();
            $this->copyDirectory($pluginDir, "{$buildPluginsDir}/{$pluginName}");
        }

    }

    public function setFile($file) {
        $this->file = $file;
    }

    public function setBuildDir($buildDir) {
        $this->buildDir = $buildDir;
    }

    public function setName($name) {
        $this->name = (string) $name;
    }

    public function getName() {
        return $this->name;
    }
}
