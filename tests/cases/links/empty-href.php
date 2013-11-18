<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
    <?php include __DIR__ . '/../../include.php'; ?>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();

        function testLink(callback) {
            return function(input) {
                var createLinkButton = getLayoutElement(input).find('.raptor-ui-link-create');
                var removeLinkButton = getLayoutElement(input).find('.raptor-ui-link-remove');
                createLinkButton.trigger('click');
                callback();
                var insertLinkButton = $('.raptor-ui-link-create-dialog button:contains(Insert Link)');
                insertLinkButton.trigger('click');
                rangesToTokens(rangy.getSelection().getAllRanges());
                if (createLinkButton.is('.ui-state-highlight')){
                    throw new Error('Create link button is active');
                }
                if (removeLinkButton.is('.ui-state-highlight')){
                    throw new Error('Remove link button is active');
                }
            }
        }
    </script>

    <div class="test-1">
        <h1>Test 1: Empty Internal Link</h1>
        <div class="test-input">
            <div class="editable">
                <ul>
                    <li>Item 1</li>
                    <li>{Item 2}</li>
                    <li>Item 3</li>
                    <li>Item 4</li>
                </ul>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <ul>
                    <li>Item 1</li>
                    <li>{Item 2}</li>
                    <li>Item 3</li>
                    <li>Item 4</li>
                </ul>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', testLink(function() {
            $('.raptor-ui-link-create-menu :input[value=0]').trigger('click');
        }));
    </script>

    <div class="test-2">
        <h1>Test 2: Empty External Link</h1>
        <div class="test-input">
            <div class="editable">
                <ul>
                    <li>Item 1</li>
                    <li>{Item 2}</li>
                    <li>Item 3</li>
                    <li>Item 4</li>
                </ul>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <ul>
                    <li>Item 1</li>
                    <li>{Item 2}</li>
                    <li>Item 3</li>
                    <li>Item 4</li>
                </ul>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-2', testLink(function() {
            $('.raptor-ui-link-create-menu :input[value=1]').trigger('click');
        }));
    </script>

    <div class="test-3">
        <h1>Test 3: Empty Email Link</h1>
        <div class="test-input">
            <div class="editable">
                <ul>
                    <li>Item 1</li>
                    <li>{Item 2}</li>
                    <li>Item 3</li>
                    <li>Item 4</li>
                </ul>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <ul>
                    <li>Item 1</li>
                    <li>{Item 2}</li>
                    <li>Item 3</li>
                    <li>Item 4</li>
                </ul>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-3', testLink(function() {
            $('.raptor-ui-link-create-menu :input[value=2]').trigger('click');
        }));
    </script>
</body>
</html>
