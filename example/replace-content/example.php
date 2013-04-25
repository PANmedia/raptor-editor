<?php
    include __DIR__ . '/../include/content.php';
    $content = loadContent(__DIR__ . '/content.json');
?>
<!doctype html>
<html>
<head>
    <?php include __DIR__ . '/../include/head.php'; ?>
    <title>Raptor Editor - Replace Content Example</title>
    <script type="text/javascript">
        jQuery(function($) {
            $('.editable').raptor({
                urlPrefix: '../../src/',
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
                },
                bind: {
                    enabling: function() {
                        var element = this.getElement();
                        element.html(atob(element.data('replacement')));
                    }
                }
            });
        });
    </script>
</head>
<body>
    <?php include __DIR__ . '/../include/nav.php'; ?>
    <?php
        $original = '
            <h1>Welcome to the (fake) login area!</h1>
            <p>Hello ${first-name} ${last-name}, how are you today?</p>
        ';
    ?>
    <div class="editable half center" data-id="body-1" data-replacement="<?= base64_encode($original) ?>">
        <?php
            $buffer = str_replace(['${first-name}', '${last-name}'], ['Raptor', 'Editor'], $original);
            echo renderContent($buffer, $content, 'body-1');
        ?>
    </div>

</body>
</html>
