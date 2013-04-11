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
                classes: 'raptor-editing-inline',
                autoEnable: true,
                draggable: false,
                unify: false,
                unloadWarning: false,
                plugins: {
                    unsavedEditWarning: false,
                    dock: {
                        dockToElement: true,
                        docked: true,
                        persist: false,
                    },
                },
                layout: {
                    type: 'toolbar',
                    options: {
                        uiOrder: [
                            ['textBold', 'textItalic', 'textUnderline', 'textStrike'],
                            ['textBlockQuote'],
                            ['listOrdered', 'listUnordered'],
                            ['textSizeDecrease', 'textSizeIncrease'],
                            ['linkCreate', 'linkRemove']
                        ]
                    }
                }
            });
        });
    </script>
    <style type="text/css">
        html {
            background-color: #efefef;
        }
        .wrapper {
            width: 960px;
            padding: 20px;
            background-color: #fff;
        }
/*        .raptor-editing {
            width: 600px;
            min-height: 150px;
            padding: 5px !important;
            background-color: #fff;
            border: 1px solid #c1c1c1 !important;
            border-top: none !important;
        }*/
    </style>
</head>
<body>
    <?php include __DIR__ . '/../include/nav.php'; ?>
    <br />
    <div class="wrapper center">
            <h1>Raptor Editor - Inline Example</h1>
        <div class="editable" data-id="body-1">
        </div>
        <button>Submit</button>
    </div>
</body>
</html>
