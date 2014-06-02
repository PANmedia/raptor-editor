<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
    <?php include __DIR__ . '/../../include.php'; ?>
</head>
<body class="simple">
    <div class="test-1">
        <h1>Insert Column 1</h1>
        <div class="test-input">
            <div class="editable">
                <table>
                    <tr>
                        <td>Cell 0,0{}</td>
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
                <table>
                    <tr>
                        <td>Cell 0,0{}</td>
                        <td>&nbsp;</td>
                        <td>Cell 1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>&nbsp;</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>&nbsp;</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
            </table>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            var ranges = tokensToRanges(input);
            clickButton(input, '.raptor-ui-table-insert-column');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-2">
        <h1>Insert Column 2</h1>
        <div class="test-input">
            <div class="editable">
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
                            <td>Cell{}</td>
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
        <div class="test-expected">
            <div class="editable">
                <table>
                    <thead>
                        <tr>
                            <th>Header</th>
                            <th>Header</th>
                            <th>&nbsp;</th>
                            <th>Header</th>
                            <th>Header</th>
                            <th>Header</th>
                            <th>Header</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Cell</td>
                            <td>Cell{}</td>
                            <td>&nbsp;</td>
                            <td>Cell</td>
                            <td rowspan="2">Cell</td>
                            <td>Cell</td>
                            <td>Cell</td>
                        </tr>
                        <tr>
                            <td>Cell</td>
                            <td colspan="3">Cell</td>
                            <td rowspan="2">Cell</td>
                            <td>Cell</td>
                        </tr>
                        <tr>
                            <td>Cell</td>
                            <td>Cell</td>
                            <td>&nbsp;</td>
                            <td colspan="2">Cell</td>
                            <td>Cell</td>
                        </tr>
                        <tr>
                            <td>Cell</td>
                            <td>Cell</td>
                            <td>&nbsp;</td>
                            <td>Cell</td>
                            <td>Cell</td>
                            <td>Cell</td>
                            <td>Cell</td>
                        </tr>
                        <tr>
                            <td>Cell</td>
                            <td colspan="3">Cell</td>
                            <td>Cell</td>
                            <td>Cell</td>
                            <td>Cell</td>
                        </tr>
                        <tr>
                            <td>Cell</td>
                            <td>Cell</td>
                            <td>&nbsp;</td>
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
                            <td>&nbsp;</td>
                            <td>Cell</td>
                            <td>Cell</td>
                            <td>Cell</td>
                            <td>Cell</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
     <script type="text/javascript">
        testEditor('.test-2', function(input) {
            var ranges = tokensToRanges(input);
            clickButton(input, '.raptor-ui-table-insert-column');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>
</body>
</html>
