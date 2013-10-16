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
        <h1>Ordered List Button 1: Active When List is Selected</h1>
         <div class="test-input">
            <div class="editable">
                {
                    <p>Item 1</p>
                    <p>Item 2</p>
                    <p>Item 3</p>
                    <p>Item 4</p>
                }
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <ol>{
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                    <li>Item 4</li>
                    }
                </ol>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            var orderedListButton = getLayoutElement(input).find('.raptor-ui-list-ordered');
            orderedListButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            if (!orderedListButton.is('.ui-state-highlight')) {
                throw new Error('Button is not active');
            }
        });
    </script>

    <div class="test-2">
        <h1>Ordered List Button 2: Active When Ordered Sublist is Selected</h1>
         <div class="test-input">
            <div class="editable">
                <ol>
                    <li>Item 1</li>
                    <li>{Item 2</li>
                    <li>Item 3</li>}
                    <li>Item 4</li>
                </ol>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <ol>
                    <li>Item 1</li>
                    <ol>
                        <li>{Item 2</li>
                        <li>Item 3</li>}
                    </ol>
                    <li>Item 4</li>
                </ol>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-2', function(input) {
            var orderedListButton = getLayoutElement(input).find('.raptor-ui-list-ordered');
            orderedListButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            if (!orderedListButton.is('.ui-state-highlight')) {
                throw new Error('Button is not active');
            }
        });
    </script>

    <div class="test-3">
        <h1>Ordered List Button 3: Active When Unordered Sublist is Selected</h1>
         <div class="test-input">
            <div class="editable">
                <ol>
                    <li>Item 1</li>
                    <li>{Item 2</li>
                    <li>Item 3</li>}
                    <li>Item 4</li>
                </ol>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <ol>
                    <li>Item 1</li>
                    <ul>
                        <li>{Item 2</li>
                        <li>Item 3</li>}
                    </ul>
                    <li>Item 4</li>
                </ol>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-3', function(input) {
            var unorderedListButton = getLayoutElement(input).find('.raptor-ui-list-unordered');
            unorderedListButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            if (unorderedListButton.is('.ui-state-highlight')) {
                throw new Error('Button is active');
            }
        });
    </script>

    <div class="test-4">
        <h1>Unordered List Button 1: Not Active When List is Not Selected</h1>
         <div class="test-input">
            <div class="editable">
                {}
                    <p>Item 1</p>
                    <p>Item 2</p>
                    <p>Item 3</p>
                    <p>Item 4</p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                {}
                <ul>
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                    <li>Item 4</li>
                </ul>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-4', function(input) {
            var unorderedListButton = getLayoutElement(input).find('.raptor-ui-list-unordered');
            unorderedListButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            if (unorderedListButton.is('.ui-state-highlight')) {
                throw new Error('Button is active');
            }
        });
    </script>

    <div class="test-5">
        <h1>Ordered List Button 4: Not Active When List is Not Selected</h1>
         <div class="test-input">
            <div class="editable">
                {}
                    <p>Item 1</p>
                    <p>Item 2</p>
                    <p>Item 3</p>
                    <p>Item 4</p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                {}
                <ol>
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                    <li>Item 4</li>
                </ol>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-5', function(input) {
            var orderedListButton = getLayoutElement(input).find('.raptor-ui-list-ordered');
            orderedListButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            if (orderedListButton.is('.ui-state-highlight')) {
                throw new Error('Button is active');
            }
        });
    </script>

        <div class="test-6">
        <h1>Unordered List Button 2: Active With Empty Selection</h1>
         <div class="test-input">
            <div class="editable">
                    <p>Ite{}m 1</p>
                    <p>Item 2</p>
                    <p>Item 3</p>
                    <p>Item 4</p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <ul>
                    <li>Ite{}m 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                    <li>Item 4</li>
                </ul>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-6', function(input) {
            var unorderedListButton = getLayoutElement(input).find('.raptor-ui-list-unordered');
            unorderedListButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            if (!unorderedListButton.is('.ui-state-highlight')) {
                throw new Error('Button is not active');
            }
        });
    </script>

    <div class="test-7">
        <h1>Ordered List Button 5: Active With Empty Selection</h1>
         <div class="test-input">
            <div class="editable">
                    <p>Ite{}m 1</p>
                    <p>Item 2</p>
                    <p>Item 3</p>
                    <p>Item 4</p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <ol>
                    <li>Ite{}m 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                    <li>Item 4</li>
                </ol>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-7', function(input) {
            var orderedListButton = getLayoutElement(input).find('.raptor-ui-list-ordered');
            orderedListButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            if (!orderedListButton.is('.ui-state-highlight')) {
                throw new Error('Button is not active');
            }
        });
    </script>

    <div class="test-8">
        <h1>Unordered List Button 3: Active When Ordered Sublist is Selected</h1>
         <div class="test-input">
            <div class="editable">
                <ol>
                    <li>Item 1</li>
                    <li>{Item 2</li>
                    <li>Item 3</li>}
                    <li>Item 4</li>
                </ol>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <ul>
                    <li>Item 1</li>
                    <ol>
                        <li>{Item 2</li>
                        <li>Item 3</li>}
                    </ol>
                    <li>Item 4</li>
                </ul>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-8', function(input) {
            var unorderedListButton = getLayoutElement(input).find('.raptor-ui-list-unordered');
            unorderedListButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            if (!unorderedListButton.is('.ui-state-highlight')) {
                throw new Error('Button is not active');
            }
        });
    </script>

    <div class="test-9">
        <h1>Unordered List Button 4: Active When Unordered Sublist is Selected</h1>
         <div class="test-input">
            <div class="editable">
                <ol>
                    <li>Item 1</li>
                    <li>{Item 2</li>
                    <li>Item 3</li>}
                    <li>Item 4</li>
                </ol>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <ul>
                    <li>Item 1</li>
                    <ul>
                        <li>{Item 2</li>
                        <li>Item 3</li>}
                    </ul>
                    <li>Item 4</li>
                </ul>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-9', function(input) {
            var unorderedListButton = getLayoutElement(input).find('.raptor-ui-list-unordered');
            unorderedListButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            if (!unorderedListButton.is('.ui-state-highlight')) {
                throw new Error('Button is not active');
            }
        });
    </script>
</body>
</html>
