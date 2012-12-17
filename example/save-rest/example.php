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
    <title>Raptor Editor - Save Rest Example</title>
    <link rel="stylesheet" href="css/style.css" />
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
        function initRaptor() {
            $('.editable').raptor({
                urlPrefix: '../../src/',
                ui: {
                    save: {
                        plugin: 'saveRest'
                    }
                },
                plugins: {
                    saveRest: {
                        url: 'save.php',
                        data: function(html) {
                            return {
                                id: this.raptor.getElement().data('id'),
                                content: html
                            };
                        }
                    }
                }
            });
        }
        jQuery(initRaptor);
    </script>
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
    <div class="editable" data-id="header">
        <?php ob_start(); ?>
        <h1>Raptor Editor - Save Rest Example</h1>
        <?php
            $buffer = ob_get_clean();
            if (isset($content['header'])) {
                echo $content['header'];
            } else {
                echo $buffer;
            }
        ?>
    </div>
    <div class="editable" data-id="body">
        <?php ob_start(); ?>
        <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard dummy text ever since the 1500s, when an unknown printer
            took a galley of type and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
            Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker
            including versions of Lorem Ipsum.
        </p>
        <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard dummy text ever since the 1500s, when an unknown printer
            took a galley of type and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
            Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker
            including versions of Lorem Ipsum.
        </p>
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
