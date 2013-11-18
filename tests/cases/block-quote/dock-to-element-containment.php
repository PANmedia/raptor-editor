<!doctype html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <script type="text/javascript" src="../../js/case.js"></script>
    <?php include __DIR__ . '/../../include.php'; ?>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();
        var options = {
            plugins: {
                dock: {
                    docked: true,
                    dockToElement: true
                }
            }
        };
    </script>
    <div class="test-1">
        <h1>List 1: unwrapped but selected content containment</h1>
        <div class="test-input">
            <div class="editable">
                {Unwrapped content}
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <blockquote>
                    <p>
                        {Unwrapped content}
                    </p>
                </blockquote>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-1', function(input) {
            tokensToSelection(input);
            listToggle('blockquote', 'p', input.find('.editable'));
            selectionToTokens();
        });
    </script>
    <div class="test-2">
        <h1>List 2: unwrapped content containment with no selection</h1>
        <div class="test-input">
            <div class="editable">
                Unwrapped content
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                Unwrapped content
            </div>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-2', function(input) {
            tokensToSelection(input);
            listToggle('blockquote', 'p', input.find('.editable'));
            selectionToTokens();
        });
    </script>
    <div class="test-3">
        <h1>List 3: unwrapped content containment with empty selection</h1>
        <div class="test-input">
            <div class="editable">
                {}Unwrapped content
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                {}Unwrapped content
            </div>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-3', function(input) {
            tokensToSelection(input);
            listToggle('blockquote', 'p', input.find('.editable'));
            selectionToTokens();
        });
    </script>
    <div class="test-4">
        <h1>List 4: click blockquote button</h1>
        <div class="test-input">
            <div class="editable">
                {Unwrapped content}
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <blockquote>
                    <p>
                        {Unwrapped content}
                    </p>
                </blockquote>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-4', function(input) {
            clickButton(input, '.raptor-ui-text-block-quote');
            selectionToTokens();
        }, options);
    </script>
</body>
</html>
