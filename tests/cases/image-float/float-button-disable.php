<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
    <?php include __DIR__ . '/../../include.php'; ?>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();
    </script>
    <div class="test-1">
        <h1>Left Float Button 1: Disabled When Image Not Selected</h1>
        <div class="test-input">
            <div class="editable">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />
                <p>
                    {Some text here}
                </p>
                <div style="clear: both"></div>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />
                <p>
                    {Some text here}
                </p>
                <div style="clear: both"></div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            var floatLeftButton = getLayoutElement(input).find('.raptor-ui-float-left');
            rangesToTokens(rangy.getSelection().getAllRanges());
            getRaptor(input).checkSelectionChange();
            if (!floatLeftButton.hasClass('ui-button-disabled')) {
                throw new Error('Button is not disabled');
            }

        });
    </script>

    <div class="test-2">
        <h1>Right Float Button 1: Disabled When Image Not Selected </h1>
        <div class="test-input">
            <div class="editable">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />
                <p>
                    {Some text here}
                </p>
                <div style="clear: both">
                </div>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />
                <p>
                    {Some text here}
                </p>
                <div style="clear: both">
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-2', function(input) {
            var floatRightButton = getLayoutElement(input).find('.raptor-ui-float-right');
            rangesToTokens(rangy.getSelection().getAllRanges());
            getRaptor(input).checkSelectionChange();
            if (!floatRightButton.hasClass('ui-button-disabled')) {
                throw new Error('Button is not disabled');
            }
        });
    </script>

     <div class="test-3">
        <h1>No Float Button 1: Disabled When Image Not Selected </h1>
        <div class="test-input">
            <div class="editable">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />
                <p>
                    {Some text here}
                </p>
                <div style="clear: both">
                </div>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />
                <p>
                    {Some text here}
                </p>
                <div style="clear: both">
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-3', function(input) {
            var floatNoneButton = getLayoutElement(input).find('.raptor-ui-float-none');
            rangesToTokens(rangy.getSelection().getAllRanges());
            getRaptor(input).checkSelectionChange();
            if (!floatNoneButton.hasClass('ui-button-disabled')) {
                throw new Error('Button is not disabled');
            }
        });
    </script>
</body>
</html>
