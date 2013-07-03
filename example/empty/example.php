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
                autoEnable: true,
                plugins: {
                    dock: {
                        docked: true,
                        under: '.switcher'
                    },
                    classMenu: {
                        classes: {
                            'Blue background': 'cms-blue-bg',
                            'Round corners': 'cms-round-corners',
                            'Indent and center': 'cms-indent-center'
                        }
                    },
                    snippetMenu: {
                        snippets: {
                            'Grey Box': '<div class="grey-box"><h1>Grey Box</h1><ul><li>This is a list</li></ul></div>'
                        }
                    }
                }
            });
        });
    </script>
</head>
<body>
    <?php include __DIR__ . '/../include/nav.php'; ?>
    <div class="half center">
        <h1>Raptor Editor - Basic Example</h1>
        <div class="editable outline" data-id="body-1">
            <?php ob_start(); ?>
            <?= renderContent(ob_get_clean(), $content, 'body-1'); ?>
        </div>
    </div>

</body>
</html>
