<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();

        function testSelectExpand(input) {
            var ranges = tokensToRanges(input);
            rangy.getSelection().setRanges(ranges);
            var range = rangy.getSelection().getRangeAt(0);
            rangeExpandWhiteSpace(range);
            $('<div>').addClass('output').html(range.extractContents()).appendTo(input);
        }
    </script>

    <div class="test-1">
        <h1>Test 1</h1>
        <div class="test-input">
            <p>
                {This is paragraph 1.}
            </p>
            <p>
                This is a paragraph 2.
            </p>
        </div>
        <div class="test-expected">
            <p>
                This is a paragraph 2.
            </p>
            <div class="output">
                <p>
                    This is paragraph 1.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-1', testSelectExpand);
    </script>

</body>
</html>