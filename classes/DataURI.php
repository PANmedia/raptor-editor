<?php
class DataURI extends Task {

    private $filesets = array();

    public function main() {
        foreach($this->filesets as $fs) {
            try {
                $files = $fs->getDirectoryScanner($this->project)->getIncludedFiles();
                foreach ($files as $file) {
                    $content = file_get_contents($file);
//                    $content = preg_replace('/background\:\s*url\(images.*\)\s*0 0\;/', '', $content);
                    $content = preg_replace_callback('/url\((.*?)\.(png|jpe?g|gif)\)/i', function($matches) use($file) {
                        $image = file_get_contents(dirname($file).'/'.$matches[1].'.'.$matches[2]);
                        $image = base64_encode($image);
                        return "url(data:image/$matches[2];base64,$image)";
                    }, $content);
                    file_put_contents($file, $content);
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
