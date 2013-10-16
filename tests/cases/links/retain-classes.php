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

            createLinkButton.trigger('click');

            $('.raptor-ui-link-create-menu :input[value=1]').trigger('click');
            document.getElementById('raptor-external-href').value = 'http://www.google.com';

            var insertLinkButton = $('.raptor-ui-link-create-dialog button:contains(Insert Link)');
            insertLinkButton.trigger('click');

            rangesToTokens(rangy.getSelection().getAllRanges());

            if (!createLinkButton.is('.ui-state-highlight')){
                throw new Error('Create link button is not active');
            }
            if (!removeLinkButton.is('.ui-state-highlight')){
                throw new Error('Remove link button is not active');
            }
        }
    </script>
    <div class="test-1">
        <h1>Create Link Button 1: Word Group Selection</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    This is my paragraph, and <a href="." class="cms-red">{here is a link}</a>.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    This is my paragraph, and <a href="http://www.google.com" class="cms-red">{here is a link}</a>.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', testLink);
    </script>
</body>
</html>
