<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
    <?php include __DIR__ . '/../../include.php'; ?>
</head>
<body class="simple">
    <div class="test-1">
        <h1>Create Table 1: No Text</h1>
        <div class="test-input">
            <div class="editable">
                Some text.{}
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                Some text.{}
                <table>
                    <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
            </table>
            </div>
        </div>
        <div class="test-output"></div>
        <div class="test-diff"></div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            clickButton(input, '.raptor-ui-table-create');

            var table = $('.raptor-ui-table-create-menu:eq(1)').find('tbody')[0];
            var rows = table.getElementsByTagName('tr');
            var cols = rows[2].getElementsByTagName('td');
            $(cols[3]).mouseover();
            $(cols[3]).click();

            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-2">
        <h1>Create Table 2: With Text</h1>
        <div class="test-input">
            <div class="editable">
                Some text.{}
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                Some text.{}
                <table>
                    <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
            </table>
            </div>
        </div>
        <div class="test-output"></div>
        <div class="test-diff"></div>
    </div>
    <script type="text/javascript">
        testEditor('.test-2', function(input) {
            clickButton(input, '.raptor-ui-table-create');

            var table = $('.raptor-ui-table-create-menu:eq(2)').find('tbody')[0];
            var rows = table.getElementsByTagName('tr');
            var cols = rows[2].getElementsByTagName('td');
            $(cols[3]).mouseover();
            $(cols[3]).click();

            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

</body>
</html>
