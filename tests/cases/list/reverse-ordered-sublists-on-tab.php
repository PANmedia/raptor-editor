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
        <h1>Ordered List 1: Create an ordered sub list from group of words</h1>
        <div class="test-input">
            <div class="editable">
                <ol>
                    <li>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                        convallis
                    </li>
                    <li>
                        dui
                        <ol>
                            <li>{id erat pellentesque}</li>
                        </ol>
                        et rhoncus
                    </li>
                    <li>
                        nunc semper. Suspendisse
                        malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                        ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                        pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                    </li>
                </ol>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <ol>
                    <li>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                        convallis
                    </li>
                    <li>dui</li>
                    <li>{id erat pellentesque}</li>
                    <li>et rhoncus</li>
                    <li>
                        nunc semper. Suspendisse
                        malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                        ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                        pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                    </li>
                </ol>

            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            var e = jQuery.Event("keydown");
            e.which = 9; //key code for tab
            e.shiftKey = true;
            $(getLayoutElement(input).find('.raptor-ui-list-ordered')).trigger(e);
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-2">
        <h1>Ordered List 2: Create an ordered sublist from single word</h1>
        <div class="test-input">
            <div class="editable">
                <ol>
                    <li>
                        Lorem ipsum dolor sit amet,
                    <ol>
                        <li>{consectetur}</li>
                    </ol>
                        adipiscing elit. Maecenas
                        convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                        malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                        ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                        pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                     </li>
                </ol>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <ol>
                    <li>Lorem ipsum dolor sit amet,</li>
                    <li>{consectetur}</li>
                    <li>adipiscing elit. Maecenas
                        convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                        malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                        ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                        pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                    </li>
                </ol>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-2', function(input) {
            var e = jQuery.Event("keydown");
            e.which = 9; //key code for tab
            e.shiftKey = true;
            $(getLayoutElement(input).find('.raptor-ui-list-ordered')).trigger(e);
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-3">
       <h1>Ordered List 3: Create an ordered sublist with multiple items selection from part word to part word</h1>
        <div class="test-input">
            <div class="editable">
                 <ol>
                    <li>
                        Lor
                        <ol>
                            <li>{em ipsum dolor sit amet, consectetur adipiscing elit.</li>
                            <li>Maecenas convallis dui id erat pellentesque et rhoncus nunc semper.</li>
                            <li>Suspendisse malesuada hendrerit velit nec tristique.</li>
                            <li>Aliquam gravida mauris at ligula venenatis rhonc}</li>
                        </ol>
                        us.
                    </li>
                </ol>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <ol>
                    <li>Lor</li>
                    <li>{em ipsum dolor sit amet, consectetur adipiscing elit.</li>
                    <li>Maecenas convallis dui id erat pellentesque et rhoncus nunc semper.</li>
                    <li>Suspendisse malesuada hendrerit velit nec tristique.</li>
                    <li>Aliquam gravida mauris at ligula venenatis rhonc}</li>
                    <li>us.</li>
                </ol>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-3', function(input) {
           var e = jQuery.Event("keydown");
            e.which = 9; //key code for tab
            e.shiftKey = true;
            $(getLayoutElement(input).find('.raptor-ui-list-ordered')).trigger(e);
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-4">
        <h1>Ordered List 4: Create an ordered sublist from a list with multiple heading items</h1>
        <div class="test-input">
            <div class="editable">
                <ol>
                    <li><h3>Item 1</h3></li>
                    <ol>
                        <li><h2>It{}em 2</h2></li>
                    </ol>
                    <li><h1>Item 3</h1></li>
                    <li><h4>Item 4</h4></li>

                </ol>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <ol>
                    <li><h3>Item 1</h3></li>
                    <li><h2>It{}em 2</h2></li>
                    <li><h1>Item 3</h1></li>
                    <li><h4>Item 4</h4></li>
                </ol>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-4', function(input) {
            var e = jQuery.Event("keydown");
            e.which = 9; //key code for tab
            e.shiftKey = true;
            $(getLayoutElement(input).find('.raptor-ui-list-ordered')).trigger(e);
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>
</body>
</html>
