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

    $type = 'include';
?>
<!doctype html>
<html>
<head>
    <?php include __DIR__ . '/../include/head.php'; ?>
    <title>Raptor Editor - Table Example</title>
    <script type="text/javascript">
        jQuery(function($) {
            $('.editable').raptor({
                urlPrefix: '../../src/'
            });
            $('tbody td').each(function() {
                var index = tableGetCellIndex(this);
                $(this).text($(this).text() + ' [' + index.x + ', ' + index.y + ']');
            });
        });
    </script>
    <style type="text/css">
        table {
            width: 100%;
        }
        td, th {
            border: 1px dotted #777;
        }
    </style>
</head>
<body>
    <?php include __DIR__ . '/../include/nav.php'; ?>
    <header>
        <h1>Raptor Editor - Table Example</h1>
    </header>
    <div class="editable" data-id="body">
        <?php ob_start(); ?>
        <table>
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
