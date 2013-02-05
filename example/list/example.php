<?php
    $file = __DIR__ . '/content.json';
    $content = [];
    if (file_exists(__DIR__ . '/content.json')) {
        $content = file_get_contents($file);
        $content = json_decode($content, true);
        if ($content === false) {
            $content = [];
        }
    }

    $type = 'include';
?>
<!doctype html>
<html>
<head>
    <?php include __DIR__ . '/../include/head.php'; ?>
    <title>Raptor Editor - Table Example</title>
    <script type="text/javascript">
        jQuery(function($) {
            $('.editable').raptor({
                urlPrefix: '../../src/'
            });
        });
    </script>
    <style type="text/css">
        table {
            width: 100%;
        }
        td, th {
            border: 1px dotted #777;
        }
    </style>
</head>
<body>
    <?php include __DIR__ . '/../include/nav.php'; ?>
    <header>
        <h1>Raptor Editor - List Example</h1>
    </header>
    <div class="editable" data-id="body">
        <?php ob_start(); ?>
        <ul>
            <li>
                Sped nightingale before invaluably unwilling amidst ready salamander virtuously as sentimental.
            </li>
            <li>
                Felt darn far examined industrious wow unaccountably the nefarious circa far.
            </li>
            <li>
                On darn gosh around wallaby thickly clung crud knelt over because antelope.
            </li>
            <li>
                After as far this crazily naive ruminant surreptitious reindeer the poured certain.
            </li>
            <li>
                Telepathic wow slight so sent subconscious and yet coarse jeepers seal tense.
            </li>
        </ul>
        <ol>
            <li>
                Sped nightingale before invaluably unwilling amidst ready salamander virtuously as sentimental.
            </li>
            <li>
                Felt darn far examined industrious wow unaccountably the nefarious circa far.
            </li>
            <li>
                On darn gosh around wallaby thickly clung crud knelt over because antelope.
            </li>
            <li>
                After as far this crazily naive ruminant surreptitious reindeer the poured certain.
            </li>
            <li>
                Telepathic wow slight so sent subconscious and yet coarse jeepers seal tense.
            </li>
        </ol>
        <ol>
            <li>
                <ul>
                    <li>
                        Sped nightingale before invaluably unwilling amidst ready salamander virtuously as sentimental.
                    </li>
                    <li>
                        Felt darn far examined industrious wow unaccountably the nefarious circa far.
                    </li>
                </ul>
            </li>
            <li>
                Felt darn far examined industrious wow unaccountably the nefarious circa far.
            </li>
            <li>
                On darn gosh around wallaby thickly clung crud knelt over because antelope.
            </li>
            <li>
                <ul>
                    <li>
                        On darn gosh around wallaby thickly clung crud knelt over because antelope.
                    </li>
                    <li>
                        After as far this crazily naive ruminant surreptitious reindeer the poured certain.
                    </li>
                    <li>
                        Telepathic wow slight so sent subconscious and yet coarse jeepers seal tense.
                    </li>
                </ul>
            </li>
            <li>
                Telepathic wow slight so sent subconscious and yet coarse jeepers seal tense.
            </li>
        </ol>
        <?php
            $buffer = ob_get_clean();
            if (isset($content['body'])) {
                echo $content['body'];
            } else {
                echo $buffer;
            }
        ?>
    </div>

</body>
</html>
