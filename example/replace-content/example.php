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

    $type = isset($_GET['type']) ? $_GET['type'] : 'include';
?>
<!doctype html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <title>Raptor Editor - Basic Example</title>
    <link rel="stylesheet" href="../assets/style.css" />
    <?php if ($type === 'light'): ?>
        <link rel="stylesheet" href="../../src/dependencies/themes/aristo/jquery-ui.css" />
        <link rel="stylesheet" href="../../src/theme/theme.css" />
        <script src="../../src/dependencies/jquery.js"></script>
        <script src="../../src/dependencies/jquery-ui.js"></script>
        <script src="../../packages/raptor.light.min.js"></script>
    <?php elseif ($type === 'rails'): ?>
        <link rel="stylesheet" type="text/css" href="../../src/dependencies/themes/redmond/jquery-ui.css" />
        <script src="../../src/dependencies/jquery.js"></script>
        <script src="../../src/dependencies/jquery-ui.js"></script>
        <script src="../../packages/raptor.rails.js"></script>
    <?php elseif ($type === 'include'): ?>
        <?php $uri = '../../src/'; include '../../src/include.php'; ?>
    <?php endif; ?>
    <script type="text/javascript">
        jQuery(function($) {
            $('.editable').raptor({
                urlPrefix: '../../src/',
                bind: {
                    enabling: function() {
                        var element = this.getElement();
                        element.html(element.data('replacement'));
                    }
                }
            });
        });
    </script>
    <style type="text/css">
        div.editable {
            float: left;
            width: 45%;
            margin: 0 1%;
        }
    </style>
</head>
<body>
    <nav>
        <a href="?">Include</a>
        <a href="?type=default">Default</a>
        <a href="?type=light">Light</a>
        <a href="?type=rails">Rails</a>
        <a href="?type=0deps">0 dependencies</a>
        <a href="?type=0depsnc">0 dependencies, no conflict</a>
    </nav>
    <div class="editable" data-id="body-1" data-replacement="This content will replace the original">
        <?php ob_start(); ?>
        <h1>This is the original content</h1>
        <p>This is the original content</p>
        <p>This is the original content</p>
        <p>This is the original content</p>
        <p>This is the original content</p>
        <?php
            $buffer = ob_get_clean();
            if (isset($content['body-1'])) {
                echo $content['body-1'];
            } else {
                echo $buffer;
            }
        ?>
    </div>

</body>
</html>
