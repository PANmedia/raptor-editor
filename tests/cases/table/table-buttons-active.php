<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
    <?php $uri = '../../../src/'; include __DIR__ . '/../../../src/include.php'; ?>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();
    </script>
    <div class="test-1">
        <h1>Table Buttons Active 1: Active When Table is Selected</h1>
        <div class="test-input">
            <div class="editable">
               <p>some text that isn't selected</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell 1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1{},2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>some text that isn't selected</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell 1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1{},2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            var createTableButton = getLayoutElement(input).find('.raptor-ui-table-create'),
                insertColumnButton = getLayoutElement(input).find('.raptor-ui-table-insert-column'),
                insertRowButton = getLayoutElement(input).find('.raptor-ui-table-insert-row'),
                deleteColumnButton = getLayoutElement(input).find('.raptor-ui-table-delete-column'),
                deleteRowButton = getLayoutElement(input).find('.raptor-ui-table-delete-row'),
                mergeCellsButton = getLayoutElement(input).find('.raptor-ui-table-merge-cells'),
                splitCellsButton = getLayoutElement(input).find('.raptor-ui-table-split-cells');

            rangesToTokens(rangy.getSelection().getAllRanges());

            if (createTableButton.is('.ui-state-disabled')) {
                throw new Error('Create table button is not active');
            }
            if (insertColumnButton.is('.ui-state-disabled')) {
                throw new Error('Insert column button is not active');
            }
            if (insertRowButton.is('.ui-state-disabled')) {
                throw new Error('Insert row button is not active');
            }
            if (deleteColumnButton.is('.ui-state-disabled')) {
                throw new Error('Delete column button is not active');
            }
            if (deleteRowButton.is('.ui-state-disabled')) {
                throw new Error('Delete row button is not active');
            }
            if (mergeCellsButton.is('.ui-state-disabled')) {
                throw new Error('Merge cells button is not active');
            }
            if (splitCellsButton.is('.ui-state-disabled')) {
                throw new Error('Split cells button is not active');
            }
        });
    </script>

    <div class="test-2">
        <h1>Table Buttons Active 2: Active When Table is Selected</h1>
        <div class="test-input">
            <div class="editable">
               <p>{some text that is selected}</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell 1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>{some text that is selected}</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell 1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-2', function(input) {
            var createTableButton = getLayoutElement(input).find('.raptor-ui-table-create'),
                insertColumnButton = getLayoutElement(input).find('.raptor-ui-table-insert-column'),
                insertRowButton = getLayoutElement(input).find('.raptor-ui-table-insert-row'),
                deleteColumnButton = getLayoutElement(input).find('.raptor-ui-table-delete-column'),
                deleteRowButton = getLayoutElement(input).find('.raptor-ui-table-delete-row'),
                mergeCellsButton = getLayoutElement(input).find('.raptor-ui-table-merge-cells'),
                splitCellsButton = getLayoutElement(input).find('.raptor-ui-table-split-cells');

            rangesToTokens(rangy.getSelection().getAllRanges());

            if (createTableButton.is('.ui-state-disabled')) {
                throw new Error('Create table button is not active');
            }
            if (!insertColumnButton.is('.ui-state-disabled')) {
                throw new Error('Insert column button is active');
            }
            if (!insertRowButton.is('.ui-state-disabled')) {
                throw new Error('Insert row button is active');
            }
            if (!deleteColumnButton.is('.ui-state-disabled')) {
                throw new Error('Delete column button is active');
            }
            if (!deleteRowButton.is('.ui-state-disabled')) {
                throw new Error('Delete row button is active');
            }
            if (!mergeCellsButton.is('.ui-state-disabled')) {
                throw new Error('Merge cells button is active');
            }
            if (!splitCellsButton.is('.ui-state-disabled')) {
                throw new Error('Split cells button is active');
            }
        });
    </script>
</body>
</html>
