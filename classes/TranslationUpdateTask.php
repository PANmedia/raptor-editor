<?php
class TranslationUpdateTask extends Task {

    private $filesets = [];
    private $name = null;

    public function jsonError($error) {
        $output = "{$error}: ";

        switch ($error) {
            case JSON_ERROR_NONE:
                $output .= ' No errors';
            break;
            case JSON_ERROR_DEPTH:
                $output .= ' Maximum stack depth exceeded';
            break;
            case JSON_ERROR_STATE_MISMATCH:
                $output .= ' Underflow or the modes mismatch';
            break;
            case JSON_ERROR_CTRL_CHAR:
                $output .= ' Unexpected control character found';
            break;
            case JSON_ERROR_SYNTAX:
                $output .= ' Syntax error, malformed JSON';
            break;
            case JSON_ERROR_UTF8:
                $output .= ' Malformed UTF-8 characters, possibly incorrectly encoded';
            break;
            default:
                $output .= ' Unknown error';
            break;
        }

        return $output;
    }

    public function main() {

        $extractorPath = realpath(__DIR__.'/../src/plugins/i18n/extractor.php');
        $baseDirectory = realpath(__DIR__.'/../src/');

        $result = [];
        foreach($this->filesets as $fs) {
            try {
                $files = $fs->getDirectoryScanner($this->project)->getIncludedFiles();
                foreach ($files as $file) {
                    $content = file_get_contents($file);
                    $matches = [];
                    if (!preg_match("/registerLocale\('([a-zA-Z_-]+)',\s'([^']+)', \{/", $content, $matches)) {
                        throw new Exception("Failed to extract locale name from {$file}");
                    }

                    $localeName = $matches[1];
                    $localeNativeName = $matches[2];

                    $command = "$(which php) {$extractorPath} -b {$baseDirectory} -l {$localeName} -n {$localeNativeName} -m";
                    system($command);
                }
            } catch (BuildException $be) {
                $this->log($be->getMessage(), Project::MSG_WARN);
            }
        }
        $this->project->setProperty($this->name, implode("\n", $result));
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
