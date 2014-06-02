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
        <h1>N/A Tag Button 1: Word Group Selection</h1>
        <div class="test-input">
            <div class="editable">
                <h4>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis {dui id erat pellentesque et rhoncus} nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </h4>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <h4>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis {dui id erat pellentesque et rhoncus} nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </h4>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            rangesToTokens(rangy.getSelection().getAllRanges());

            var tagMenu = getLayoutElement(input).find('.raptor-ui-tag-menu');
            var tagMenuValue = tagMenu.toString();

            if (!tagMenuValue === 'N/A') {
                throw new Error('Button is not active');
            }
        });
    </script>

    <div class="test-2">
        <h1>Paragraph Tag Button 1: Active in Paragraph Word Group Selection</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis {dui id erat pellentesque et rhoncus} nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis {dui id erat pellentesque et rhoncus} nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-2', function(input) {
            rangesToTokens(rangy.getSelection().getAllRanges());

            var tagMenu = getLayoutElement(input).find('.raptor-ui-tag-menu');
            var tagMenuValue = tagMenu.toString();

            if (!tagMenuValue === 'Paragraph') {
                throw new Error('Button is not active');
            }
        });
    </script>

    <div class="test-3">
        <h1>Heading 1 Tag Button 1: Active in Paragraph Word Group Selection</h1>
        <div class="test-input">
            <div class="editable">
                <h1>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis {dui id erat pellentesque et rhoncus} nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </h1>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <h1>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis {dui id erat pellentesque et rhoncus} nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </h1>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-3', function(input) {
            rangesToTokens(rangy.getSelection().getAllRanges());

            var tagMenu = getLayoutElement(input).find('.raptor-ui-tag-menu');
            var tagMenuValue = tagMenu.toString();

            if (!tagMenuValue === 'Headung 1') {
                throw new Error('Button is not active');
            }
        });
    </script>

    <div class="test-4">
        <h1>Heading 2 Tag Button 1: Active in Paragraph Word Group Selection</h1>
        <div class="test-input">
            <div class="editable">
                <h2>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis {dui id erat pellentesque et rhoncus} nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </h2>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <h2>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis {dui id erat pellentesque et rhoncus} nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </h2>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-4', function(input) {
            rangesToTokens(rangy.getSelection().getAllRanges());

            var tagMenu = getLayoutElement(input).find('.raptor-ui-tag-menu');
            var tagMenuValue = tagMenu.toString();

            if (!tagMenuValue === 'Heading 2') {
                throw new Error('Button is not active');
            }
        });
    </script>

    <div class="test-5">
        <h1>Heading 3 Tag Button 1: Active in Paragraph Word Group Selection</h1>
        <div class="test-input">
            <div class="editable">
                <h3>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis {dui id erat pellentesque et rhoncus} nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </h3>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <h3>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis {dui id erat pellentesque et rhoncus} nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </h3>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-5', function(input) {
            rangesToTokens(rangy.getSelection().getAllRanges());

            var tagMenu = getLayoutElement(input).find('.raptor-ui-tag-menu');
            var tagMenuValue = tagMenu.toString();

            if (!tagMenuValue === 'Heading 3') {
                throw new Error('Button is not active');
            }
        });
    </script>
</body>
</html>
