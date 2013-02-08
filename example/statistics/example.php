<?php
    include __DIR__ . '/../include/content.php';
    $content = loadContent(__DIR__ . '/content.json');
?>
<!doctype html>
<html>
<head>
    <?php include __DIR__ . '/../include/head.php'; ?>
    <title>Raptor Editor - Basic Example</title>
    <script type="text/javascript">
        jQuery(function($) {
            $('.editable').raptor({
                urlPrefix: '../../src/',
                plugins: {
                    dock: {
                        docked: true,
                        under: '.switcher'
                    },
                    statistics: {
                        maximum: 36
                    }
                },
                autoEnable: true
            });
        });
    </script>
    <style type="text/css">
        table {
            width: 100%;
            /*-webkit-user-select: none;*/
        }
        td, th {
            border: 1px dotted #777;
        }

        div.editable {
            float: left;
            width: 45%;
            margin: 0 1%;
        }
    </style>
</head>
<body>
    <?php include __DIR__ . '/../include/nav.php'; ?>
    <header>
        <h1>Raptor Editor - Basic Example</h1>
    </header>
    <div style="clear: both"></div>
    <div class="editable" data-id="body-1">
        <?php ob_start(); ?>
        <p>There are 36 words in this paragraph</p>
        <?= renderContent(ob_get_clean(), $content, 'body-1'); ?>
    </div>
</body>
</html>
