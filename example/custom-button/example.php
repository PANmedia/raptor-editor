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
        // Test for no conflict version
        var init;
        if (typeof raptor !== 'undefined') {
            init = raptor;
        } else if (typeof jQuery !== 'undefined') {
            init = jQuery;
        } else {
            alert('Could not find initialiser');
        }
        Raptor.extendLocale('en', {
            customButtonTitle: 'My Custom Button'
        });
        Raptor.registerUi(new Raptor.Button({
            name: 'customButton',
            click: function() {
                Raptor.selectionReplace('<b>My super awesome button</b>');
            }
        }));
        Raptor.defaults.layouts.toolbar.uiOrder[0].unshift('customButton');
        init(function($) {
            $('#left').raptor({
                urlPrefix: '../../src/'
            });
        });

    </script>
</head>
<body>
    <?php include __DIR__ . '/../include/nav.php'; ?>
    <div class="editable half center" id="left" data-id="body-1">
        <?php ob_start(); ?>
            <h1>Raptor Editor - Custom Button Example</h1>
            <p>
                Custom button example.
            </p>
        <?= renderContent(ob_get_clean(), $content, 'body-1'); ?>
    </div>
</body>
</html>
