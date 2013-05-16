<?php
    include __DIR__ . '/../include/content.php';
    $content = loadContent(__DIR__ . '/content.json');
?>
<!doctype html>
<html>
<head>
    <?php include __DIR__ . '/../include/head.php'; ?>
    <title>Raptor Editor - Table Example</title>
    <script type="text/javascript">
        jQuery(function($) {
            $('.editable').raptor({
                urlPrefix: '../../src/',
                bind: {
                    enabled: function() {
                        this.getElement().find('table').resizable();
                    },
                    disabled: function() {
                        this.getElement().find('table').resizable('destroy');
                    }
                },
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
    <div class="editable half center" data-id="body-1">
        <?php ob_start(); ?>
        <h1>Raptor Editor - Resizable Table Example</h1>
        <table style="width: 200px;">
            <thead>
                <tr>
                    <th>Header</th>
                    <th>Header</th>
                    <th>Header</th>
                    <th>Header</th>
                    <th>Header</th>
                    <th>Header</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td rowspan="2">Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                </tr>
                <tr>
                    <td>Cell</td>
                    <td colspan="2">Cell</td>
                    <td rowspan="2">Cell</td>
                    <td>Cell</td>
                </tr>
                <tr>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td colspan="2">Cell</td>
                    <td>Cell</td>
                </tr>
                <tr>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                </tr>
                <tr>
                    <td>Cell</td>
                    <td colspan="2">Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                </tr>
                <tr>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th>Header</th>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                    <td>Cell</td>
                </tr>
            </tfoot>
        </table>
        <?= renderContent(ob_get_clean(), $content, 'body-1'); ?>
    </div>

</body>
</html>
