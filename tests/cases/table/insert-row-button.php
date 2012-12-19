<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
    <?php $uri = '../../../src/'; include __DIR__ . '/../../../src/include.php'; ?>
</head>
<body class="simple">
    <div class="test-1">
        <h1>Insert Row 1</h1>
        <div class="test-input">
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
        <div class="test-expected">
            <table>
                <tr>
                    <td>Cell 0,0</td>
                    <td>Cell 1,0</td>
                    <td>Cell 2,0</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
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
   <script type="text/javascript">
        testEditor('.test-1', function(input) {
            input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-table-insert-row').trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-2">
        <h1>Insert Row 2</h1>
        <div class="test-input">
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
        </div>
        <div class="test-expected">
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
                        <td>Cell</td>
                        <td>Cell</td>
                        <td>Cell</td>
                        <td>Cell</td>
                    </tr>
                    <tr>
                        <td>Cell</td>
                        <td colspan="2">Cell</td>
                        <td>Cell</td>
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
        </div>
    </div>
   <script type="text/javascript">
        testEditor('.test-2', function(input) {
            input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-table-insert-row').trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-3">
        <h1>Insert Header 1</h1>
        <div class="test-input">
            <table>
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
        </div>
        <div class="test-expected">
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
        </div>
    </div>
   <script type="text/javascript">
        testEditor('.test-3', function(input) {
            input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-table-insert-row').trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-4">
        <h1>Insert Footer 1</h1>
        <div class="test-input">
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
            </table>
        </div>
        <div class="test-expected">
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
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-4', function(input) {
            input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-table-insert-row').trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>
</body>
</html>

