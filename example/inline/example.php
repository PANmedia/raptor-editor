<?php
    include __DIR__ . '/../include/content.php';
    $content = loadContent(__DIR__ . '/content.json');
    ksort($content);
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
                reloadOnDisable: true,
                plugins: {
                    unsavedEditWarning: false,
                    dock: {
                        dockToElement: true,
                        docked: true,
                        persist: false
                    },
                    save: {
                        plugin: 'saveJson'
                    },
                    saveJson: {
                        url: 'save.php',
                        postName: 'raptor-content',
                        id: function() {
                            return (new Date()).getTime();
                        }
                    },
                    placeholder: false
                },
                layouts: {
                    toolbar: {
                        uiOrder: [
                            ['textBold', 'textItalic', 'textUnderline', 'textStrike'],
                            ['colorMenuBasic'],
                            ['textBlockQuote'],
                            ['listOrdered', 'listUnordered'],
                            ['textSizeDecrease', 'textSizeIncrease'],
                            ['linkCreate', 'linkRemove'],
                            ['save']
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
        h4 {
            padding: 0;
            margin: 5px 0 0 0;
        }
    </style>
</head>
<body>
    <?php include __DIR__ . '/../include/nav.php'; ?>
    <br />
    <div class="wrapper center">
        <h1>Raptor Editor - Inline Example</h1>
        <textarea name="comment" class="editable"></textarea>
        <br/>
        <button>Submit</button>
        <?php foreach ($content as $key => $comment): ?>
            <h4><?= date('Y-m-d H:i:s', $key); ?></h4>
            <div>
                <?= $comment; ?>
            </div>
        <?php endforeach; ?>
    </div>
</body>
</html>
