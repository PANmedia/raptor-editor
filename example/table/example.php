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
    <?php elseif ($type === 'include'): ?>
        <?php $uri = '../../src/'; include '../../src/include.php'; ?>
    <?php endif; ?>
    <script type="text/javascript">
        jQuery(function($) {
            $('.editable').editor({
                urlPrefix: '../../src/'
            });
        });
    </script>
    <script type="text/javascript">
    /*
        var startIndex;
        $('td, th').live('mousedown', function() {
            if (typeof this.cellIndex !== 'undefined') {
                startIndex = tableGetCellIndex(this);
            }
        });
        $('td, th').live('mouseup', function() {
            console.log(startIndex, tableGetCellIndex(this));
            var table = $(this).parents('table').get(0),
                cells = tableCellsInRange(table, startIndex, tableGetCellIndex(this));
            $('.cms-table-cell-selected').removeClass('cms-table-cell-selected');
            $(cells).each(function() {
                $(this).addClass('cms-table-cell-selected');
            });
        });
    */

        $(function() {
            $('tbody td').each(function() {
                var index = tableGetCellIndex(this);
                $(this).text($(this).text() + ' [' + index.x + ', ' + index.y + ']');
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

        .cms-table-cell-selected {
            background-color: #aaf;
        }
    </style>
</head>
<body>
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
