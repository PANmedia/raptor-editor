<?php
class TranslationCheckTask extends Task {

    private $filesets = array();
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
        $result = array();
        foreach($this->filesets as $fs) {
            try {
                $files = $fs->getDirectoryScanner($this->project)->getIncludedFiles();
                foreach ($files as $file) {

                    $name = basename($file);

                    $fileContentArray = file($file);
                    foreach ($fileContentArray as $key => $value) {

                        // Parse contributors from form: @author Raptor, info@raptor-editor.com, http://www.raptor-editor.com/
                        if (preg_match("/@author/i", $value)) {
                            $matches = array();
                            preg_match("/\@author\s{0,}([^,]+),\s{0,}([^,]+),\s{0,}([^$]+)/i", $value, $matches, PREG_OFFSET_CAPTURE);
                            $author = array(
                                'name' => trim($matches[1][0]),
                                'email' => trim($matches[2][0]),
                                'link' => trim($matches[3][0])
                            );
                            if (!isset($result[$name]['contributors'])) $result[$name]['contributors'] = array();
                            $result[$name]['contributors'][] = $author;
                        }

                        if (preg_match("/registerLocale\('[a-z_-]+', '[^']+'/i", $value)) {
                            $matches = array();
                            preg_match("/registerLocale\('[a-z_-]+', '([^']+)'/i", $value, $matches, PREG_OFFSET_CAPTURE);
                            $result[$name]['nativeName'] = $matches[1][0];
                            unset($fileContentArray[$key]);
                            break;
                        }
                        unset($fileContentArray[$key]);
                    }
                    array_pop($fileContentArray);

                    array_unshift($fileContentArray, '{');
                    array_push($fileContentArray, '}');

                    $fileContent = implode('', $fileContentArray);
                    $fileContent = str_replace("\\'", "'", $fileContent);
                    $filePairs = json_decode($fileContent, true);

                    if (!$filePairs) {
                        var_dump($file);
                        echo PHP_EOL.$this->jsonError(json_last_error());
                        die();
                    }

                    if ($name === 'en.js') {
                        $result[$name]['percent'] = 100;
                        continue;
                    }

                    $translated = 0;
                    $result[$name]['untranslated'] = [];

                    foreach ($filePairs as $key => $value) {
                        if ($key !== $value)/* || in_array($key, $this->untranslatable))*/ $translated++;
                        else $result[$name]['untranslated'][] = $value;
                    }

                    $percentDone = $translated == 0 ? 0 : round(($translated / count($filePairs)) * 100);
                    $result[$name]['percent'] = $percentDone;
                }

                uasort($result, function($a, $b) {
                    if ($a['percent'] == $b['percent']) {
                        return 0;
                    }
                    return ($a['percent'] > $b['percent']) ? -1 : 1;
                });

                ob_start();
                include __DIR__.'/../views/translation-status.php';
                $html = ob_get_clean();

                file_put_contents('translation-status.html', $html);
                echo 'Written to: '.realpath(__DIR__.'/../translation-status.html');

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
