<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
    <?php $uri = '../../../src/'; include __DIR__ . '/../../../src/include.php'; ?>
</head>
<body class="simple">
    <div class="test-1">
        <h1>Remove Column 1</h1>
        <div class="test-input">
            <div class="editible">
                 <table>
                <tr>
                    <td>Column 1</td>
                    <td>{}Column 2</td>
                    <td>Column 3</td>
                </tr>
                <tr>
                    <td>Column 1</td>
                    <td>Column 2</td>
                    <td>Column 3</td>
                </tr>
                <tr>
                    <td>Column 1</td>
                    <td>Column 2</td>
                    <td>Column 3</td>
                </tr>
            </table>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <table>
                <tr>
                    <td>Column 1</td>
                    <td>Column 3</td>
                </tr>
                <tr>
                    <td>Column 1</td>
                    <td>Column 3</td>
                </tr>
                <tr>
                    <td>Column 1</td>
                    <td>Column 3</td>
                </tr>
            </table>
            </div>
        </div>
        <div class="test-output"></div>
        <div class="test-diff"></div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            clickButton(input, '.raptor-ui-table-remove-column');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-2">
        <h1>Remove Column 2</h1>
        <div class="test-input">
            <div class="editible">
                <table>
                <thead>
                    <tr>
                        <th>Header</th>
                        <th>Header</th>
                        <th>Header</th>
                        <th>Header</th>
                        <th>{}Header</th>
                        <th>Header</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Column 1</td>
                        <td>Column 2</td>
                        <td>Column 3</td>
                        <td rowspan="2">Column 4</td>
                        <td>Column 5</td>
                        <td>Column 6</td>
                    </tr>
                    <tr>
                        <td>Column 1</td>
                        <td colspan="2">Column 2</td>
                        <td rowspan="2">Column 5</td>
                        <td>Column 6</td>
                    </tr>
                    <tr>
                        <td>Column 1</td>
                        <td>Column 2</td>
                        <td colspan="2">Column 3</td>
                        <td>Column 6</td>
                    </tr>
                    <tr>
                        <td>Column 1</td>
                        <td>Column 2</td>
                        <td>Column 3</td>
                        <td>Column 4</td>
                        <td>Column 5</td>
                        <td>Column 6</td>
                    </tr>
                    <tr>
                        <td>Column 1</td>
                        <td colspan="2">Column 2</td>
                        <td>Column 4</td>
                        <td>Column 5</td>
                        <td>Column 6</td>
                    </tr>
                    <tr>
                        <td>Column 1</td>
                        <td>Column 2</td>
                        <td>Column 3</td>
                        <td>Column 4</td>
                        <td>Column 5</td>
                        <td>Column 6</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th>Footer</th>
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
        <div class="test-expected">
            <div class="editible">
                <table>
                <thead>
                    <tr>
                        <th>Header</th>
                        <th>Header</th>
                        <th>Header</th>
                        <th>Header</th>
                        <th>Header</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Column 1</td>
                        <td>Column 2</td>
                        <td>Column 3</td>
                        <td rowspan="2">Column 4</td>
                        <td>Column 6</td>
                    </tr>
                    <tr>
                        <td>Column 1</td>
                        <td colspan="2">Column 2</td>
                        <td>Column 6</td>
                    </tr>
                    <tr>
                        <td>Column 1</td>
                        <td>Column 2</td>
                        <td colspan="2">Column 3</td>
                        <td>Column 6</td>
                    </tr>
                    <tr>
                        <td>Column 1</td>
                        <td>Column 2</td>
                        <td>Column 3</td>
                        <td>Column 4</td>
                        <td>Column 6</td>
                    </tr>
                    <tr>
                        <td>Column 1</td>
                        <td colspan="2">Column 2</td>
                        <td>Column 4</td>
                        <td>Column 6</td>
                    </tr>
                    <tr>
                        <td>Column 1</td>
                        <td>Column 2</td>
                        <td>Column 3</td>
                        <td>Column 4</td>
                        <td>Column 6</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th>Footer</th>
                        <td>Cell</td>
                        <td>Cell</td>
                        <td>Cell</td>
                        <td>Cell</td>
                    </tr>
                </tfoot>
            </table>
            </div>
        </div>
        <div class="test-output"></div>
        <div class="test-diff"></div>
    </div>
     <script type="text/javascript">
        testEditor('.test-2', function(input) {
            clickButton(input, '.raptor-ui-table-remove-column');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>
</body>
</html>
