<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
    <?php include __DIR__ . '/../../include.php'; ?>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();

        function testLink(input) {
            var createLinkButton = getLayoutElement(input).find('.raptor-ui-link-create');
            var removeLinkButton = getLayoutElement(input).find('.raptor-ui-link-remove');
            rangesToTokens(rangy.getSelection().getAllRanges());
            if (createLinkButton.is('.ui-state-disabled')) {
                throw new Error('Create link button is disabled');
            }
            if (!removeLinkButton.is('.ui-state-disabled')) {
                throw new Error('Remove link button is not disabled');
            }
        }
    </script>
    <div class="test-1">
        <h1>Test remove link button is disabled</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    This {is a paragraph}.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    This {is a paragraph}.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', testLink);
    </script>
</body>
</html>
