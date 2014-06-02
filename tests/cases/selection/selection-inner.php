<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();

        function testSelectInner(input) {
            selectionSelectInner(input.find('.target').get(0));
            rangesToTokens(rangy.getSelection().getAllRanges());
        }
    </script>

    <div class="test-1">
        <h1>Test 1</h1>
        <div class="test-input">
            <p class="target">
                This is a paragraph.
            </p>
        </div>
        <div class="test-expected">
            <p class="target">
                {This is a paragraph.}
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-1', testSelectInner);
    </script>

    <div class="test-2">
        <h1>Test 2</h1>
        <div class="test-input">
            <p>
                This is paragraph 1.
            </p>
            <blockquote class="target">
                <p>
                    This is paragraph 2.
                </p>
                <p>
                    This is paragraph 3.
                </p>
            </blockquote>
            <p>
                This is paragraph 4.
            </p>
        </div>
        <div class="test-expected">
            <p>
                This is paragraph 1.
            </p>
            <blockquote class="target">
                <p>
                    {This is paragraph 2.
                </p>
                <p>
                    This is paragraph 3.}
                </p>
            </blockquote>
            <p>
                This is paragraph 4.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-2', testSelectInner);
    </script>

</body>
</html>