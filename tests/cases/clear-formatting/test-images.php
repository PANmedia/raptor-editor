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
        <h1>Clear Formatting Button 1: Basic</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    Test 1 {paragraph 1 start.
                    <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" class="cms-float-right" />
                    Test 1 paragraph} 1 end.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>
                    Test 1 {paragraph 1 start.
                    <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" class="cms-float-right" />
                    Test 1 paragraph} 1 end.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

</body>
</html>