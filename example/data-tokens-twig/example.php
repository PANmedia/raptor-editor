<?php
    include __DIR__ . '/../include/content.php';
    include __DIR__ . '/../include/twig.php';
    $content = loadContent(__DIR__ . '/content.json');
?>
<!doctype html>
<html>
<head>
    <?php include __DIR__ . '/../include/head.php'; ?>
    <title>Raptor Editor - Table Example</title>
    <script type="text/javascript" src="https://raw.github.com/justjohn/twig.js/master/twig.js"></script>
    <script type="text/javascript">
        jQuery(function($) {
            $('.editable').raptor({
                urlPrefix: '../../src/',
                plugins: {
                    save: {
                        plugin: 'saveJson'
                    },
                    saveJson: {
                        url: 'save.php',
                        postName: 'raptor-content',
                        id: function() {
                            return this.raptor.getElement().data('id');
                        }
                    }
                },
                bind: {
                    enabling: function() {
                        var element = this.getElement();
                        var text = atob(element.attr('data-source'));
                        element.html(text);
                    },
                    saved: function() {
                        var html = this.getHtml();
                        this.getElement().attr('data-source', btoa(html));
                        console.log(html);
                        var twigTemplate = twig({
                            data: html
                        });
                        this.getElement().html(twigTemplate.render(this.getElement().data('data')));
                    }
                }
            });
        });
    </script>
    <style type="text/css">
        .raptor-resize {
            cursor: move;
        }
    </style>
</head>
<body>
    <?php include __DIR__ . '/../include/nav.php'; ?>
    <?php ob_start(); ?>
    <h1>Raptor Editor - Data Token Example</h1>
    <p>
        Hello {{ person.name }}
    </p>
    {% for transaction in transactions %}
        <p>{{ transaction }}</p>
    {% endfor %}
    <?php
        $data = [
            'person' => [
                'name' => 'John Smith',
            ],
            'transactions' => [
                1025.99,
                499.99,
                35.00,
                -100.00,
            ]
        ];
        $source = renderContent(ob_get_clean(), $content, 'body-1');
        $html = renderTwig($source, $data);
    ?>
    <div class="editable half center" data-id="body-1" data-source="<?= base64_encode($source); ?>" data-data='<?= json_encode($data); ?>'>
        <?= $html; ?>
    </div>
</body>
</html>
