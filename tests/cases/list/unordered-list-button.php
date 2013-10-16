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
        <h1>Unordered List 1: Create an unordered list from group of words</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    This is the first part of the paragraph. {This is the second
                    part.} This is the third.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    This is the first part of the paragraph.
                </p>
                <ul>
                    <li>
                        {<p>
                            This is the second part.
                        </p>}
                    </li>
                </ul>
                <p>
                    This is the third.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            var unorderedListButton = getLayoutElement(input).find('.raptor-ui-list-unordered');
            unorderedListButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            if (!unorderedListButton.is('.ui-state-highlight')){
                throw new Error('Button is not active');
            }
        });
    </script>

    <div class="test-2">
        <h1>Unordered List 2: Create an unordered list from single word</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    First part of {the} paragraph.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                   First part of
                </p>
                <ul>
                    <li>
                        {<p>
                            the
                        </p>}
                    </li>
                </ul>
                <p>
                    paragraph.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-2', function(input) {
            var unorderedListButton = getLayoutElement(input).find('.raptor-ui-list-unordered');
            unorderedListButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            if (!unorderedListButton.is('.ui-state-highlight')){
                throw new Error('Button is not active');
            }
        });
    </script>
    <div class="test-3">
        <h1>Unordered List 3: Create an unordered list from empty selection before a word</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    This is {}paragraph #1.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <ul>
                    <li>
                        {<p>
                            This is paragraph #1.
                        </p>}
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-3', function(input) {
            var unorderedListButton = getLayoutElement(input).find('.raptor-ui-list-unordered');
            unorderedListButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            if (!unorderedListButton.is('.ui-state-highlight')){
                throw new Error('Button is not active');
            }
        });
    </script>
    <div class="test-4">
        <h1>Unordered List 4: Create an unordered list from empty selection inside a word</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    This is parag{}raph #1.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <ul>
                    <li>
                        {<p>
                            This is paragraph #1.
                        </p>}
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-4', function(input) {
            var unorderedListButton = getLayoutElement(input).find('.raptor-ui-list-unordered');
            unorderedListButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            if (!unorderedListButton.is('.ui-state-highlight')){
                throw new Error('Button is not active');
            }
        });
    </script>
    <div class="test-5">
       <h1>Unordered List 5: Create an unordered list with multiple items selection from part word to part word</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    This {is the first paragraph.
                </p>
                <p>
                    This is the second paragraph.
                </p>
                <p>
                    This is the third paragraph.
                </p>
                <p>
                    This is the fourth }paragraph.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    This
                </p>
                <ul>
                    <li>
                        {<p>
                            is the first paragraph.
                        </p>}
                    </li>
                    <li>
                        <p>
                            This is the second paragraph.
                        </p>
                    </li>
                    <li>
                        <p>
                            This is the third paragraph.
                        </p>
                    </li>
                    <li>
                        <p>
                            This is the fourth
                        </p>
                    </li>
                </ul>
                <p>
                    paragraph.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-5', function(input) {
            var unorderedListButton = getLayoutElement(input).find('.raptor-ui-list-unordered');
            unorderedListButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            if (!unorderedListButton.is('.ui-state-highlight')){
                throw new Error('Button is not active');
            }
        });
    </script>

    <div class="test-6">
        <h1>Unordered List 6: Create an unordered list with multiple items</h1>
        <div class="test-input">
            <div class="editable">
                {
                    <p>
                        Item 1
                    </p>
                    <p>
                        Item 2
                    </p>
                    <p>
                        Item 3
                    </p>
                    <p>
                        Item 4
                    </p>
                }
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <ul>
                    <li>
                        {<p>
                            Item 1
                        </p>}
                    </li>
                    <li>
                        <p>
                            Item 2
                        </p>
                    </li>
                    <li>
                        <p>
                            Item 3
                        </p>
                    </li>
                    <li>
                        <p>
                            Item 4
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-6', function(input) {
            var unorderedListButton = getLayoutElement(input).find('.raptor-ui-list-unordered');
            unorderedListButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            if (!unorderedListButton.is('.ui-state-highlight')){
                throw new Error('Button is not active');
            }
        });
    </script>

    <div class="test-7">
        <h1>Unordered List 7: Create an unordered list with multiple heading items</h1>
        <div class="test-input">
            <div class="editable">
                {
                    <h3>Item 1</h3>
                    <h2>Item 2</h2>
                    <h1>Item 3</h1>
                    <h4>Item 4</h4>
                }
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <ul>
                    <li>
                        {<h3>Item 1</h3>}
                    </li>
                    <li>
                        <h2>Item 2</h2>
                    </li>
                    <li>
                        <h1>Item 3</h1>
                    </li>
                    <li>
                        <h4>Item 4</h4>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-7', function(input) {
            var unorderedListButton = getLayoutElement(input).find('.raptor-ui-list-unordered');
            unorderedListButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            if (!unorderedListButton.is('.ui-state-highlight')){
                throw new Error('Button is not active');
            }
        });
    </script>
    <div class="test-8">
        <h1>Unordered List 8: Toggle bottom list of two lists and check selection remains on bottom list</h1>
        <div class="test-input">
            <div class="editable">
                <ul>
                    <li><h3>Item 1</h3></li>
                </ul>
                 <h2>{Item 2}</h2>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <ul>
                    <li>
                        <h3>Item 1</h3>
                    </li>
                </ul>
                <ul>
                    <li>
                        {<h2>Item 2</h2>}
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-8', function(input) {
            var unorderedListButton = getLayoutElement(input).find('.raptor-ui-list-unordered');
            unorderedListButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            if (!unorderedListButton.is('.ui-state-highlight')){
               throw new Error('Button is not active');
            }
        });
    </script>
</body>
</html>
