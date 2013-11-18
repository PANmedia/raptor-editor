<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
    <?php include __DIR__ . '/../../include.php'; ?>
</head>
<body class="simple">
    <div class="test-1">
        <h1>Split Cells 1 - Columns and Rows</h1>
        <div class="test-input">
            <div class="editable">
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell 1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td colspan="2" rowspan="2">
                            Cell 1,1<br/>
                            Cell 2,1<br/>
                            Cell 1,2<br/>
                            Cell 2,2
                        </td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell 1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>
                            Cell 1,1<br/>
                            Cell 2,1<br/>
                            Cell 1,2<br/>
                            Cell 2,2
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td></td>
                        <td></td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
   <script type="text/javascript">
        testEditor('.test-1', function(input) {
            clickButton(input, '.raptor-ui-table-split-cells');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-2">
        <h1>Split Cells 2 - Across a Column </h1>
        <div class="test-input">
            <div class="editable">
            <table>
                <tr>
                    <td>Cell 0,0</td>
                    <td>Cell 1,0</td>
                    <td>Cell 2,0</td>
                </tr>
                <tr>
                    <td>Cell 0,1</td>
                    <td colspan="2">
                        {Cell 1,1     Cell 2,1}<br/>
                    </td>
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
                        <td>Cell 0,0</td>
                        <td>Cell 1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>{Cell 1,1     Cell 2,1}<br/></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>{Cell 1,2}</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
   <script type="text/javascript">
        testEditor('.test-2', function(input) {
            clickButton(input, '.raptor-ui-table-split-cells');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-3">
        <h1>Split Cells 3 - Across a Row</h1>
        <div class="test-input">
            <div class="editable">
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell 1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td rowspan="2">
                            Cell 1,1<br/>
                            Cell 1,2<br/>
                        </td>
                        <td> Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell 1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>
                            Cell 1,1<br/>
                            Cell 1,2<br/>
                        </td>
                        <td> Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td></td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
   <script type="text/javascript">
        testEditor('.test-3', function(input) {
            clickButton(input, '.raptor-ui-table-split-cells');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

</body>
</html>



