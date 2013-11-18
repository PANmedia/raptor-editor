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
        <h1>H1 Tag Button 1: Word Group Selection</h1>
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
                    convallis
                </p><h1>
                    {dui id erat pellentesque et rhoncus}
                </h1><p>
                    nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            var tagMenu = clickButton(input, '.raptor-ui-tag-menu');
            var h1Tag = $('.raptor-ui-tag-menu-menu [data-value=h1]');
            h1Tag.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            var tagMenuValue = tagMenu.toString();

            if (!tagMenuValue === 'Heading 1'){
                throw new Error('Button is not active');
            }
        });
    </script>

    <div class="test-2">
        <h1>H1 Tag Button 2: Single Word Selection</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur {adipiscing} elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur
                </p><h1>
                    {adipiscing}
                </h1><p>
                    elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-2', function(input) {
            var tagMenu = clickButton(input, '.raptor-ui-tag-menu');
            var h1Tag = $('.raptor-ui-tag-menu-menu [data-value=h1]');
            h1Tag.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            var tagMenuValue = tagMenu.toString();

            if (!tagMenuValue === 'Heading 1'){
                throw new Error('Button is not active');
            }
        });
    </script>

    <div class="test-3">
        <h1>H1 Tag Button 3: Part Word Selection</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pel{lentesqu}e et rhoncus nunc semper. Suspendisse
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
                    convallis dui id erat pel
                </p><h1>
                    {lentesqu}
               </h1><p>
                    e et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-3', function(input) {
            var tagMenu = clickButton(input, '.raptor-ui-tag-menu');
            var h1Tag = $('.raptor-ui-tag-menu-menu [data-value=h1]');
            h1Tag.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            var tagMenuValue = tagMenu.toString();

            if (!tagMenuValue === 'Heading 1'){
                throw new Error('Button is not active');
            }
        });
    </script>

     <div class="test-4">
        <h1>H1 Tag Button 4: Multi-Paragraph Selection</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui {id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p><p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse} interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui
                </p><h1>
                    {id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </h1><h1>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse}
               </h1><p> interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-4', function(input) {
            var tagMenu = clickButton(input, '.raptor-ui-tag-menu');
            var h1Tag = $('.raptor-ui-tag-menu-menu [data-value=h1]');
            h1Tag.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            var tagMenuValue = tagMenu.toString();

            if (!tagMenuValue === 'Heading 1'){
                throw new Error('Button is not active');
            }
        });
    </script>

    <div class="test-5">
        <h1>H1 Tag Button 5: Multi-Paragraph Selection</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p>
                <h1>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.}
                </h1>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <h1>
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </h1>
                <h1>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.}
                </h1>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-5', function(input) {
            var tagMenu = clickButton(input, '.raptor-ui-tag-menu');
            var h1Tag = $('.raptor-ui-tag-menu-menu [data-value=h1]');
            h1Tag.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            var tagMenuValue = tagMenu.toString();

            if (!tagMenuValue === 'Heading 1'){
                throw new Error('Button is not active');
            }
        });
    </script>


    <div class="test-6">
        <h1>H1 Tag Button 6: Empty Selection in Word</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p>
                <p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspen{}disse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p>
                <h1>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspen{}disse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </h1>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-6', function(input) {
            var tagMenu = clickButton(input, '.raptor-ui-tag-menu');
            var h1Tag = $('.raptor-ui-tag-menu-menu [data-value=h1]');
            h1Tag.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            var tagMenuValue = tagMenu.toString();

            if (!tagMenuValue === 'Heading 1'){
                throw new Error('Button is not active');
            }
        });
    </script>

    <div class="test-7">
        <h1>H1 Tag Button 7: Empty Selection at the Beginning of a Word</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada {}hendrerit velit nec tristique.
                </p>
                <p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <h1>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada {}hendrerit velit nec tristique.
                </h1>
                <p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-7', function(input) {
            var tagMenu = clickButton(input, '.raptor-ui-tag-menu');
            var h1Tag = $('.raptor-ui-tag-menu-menu [data-value=h1]');
            h1Tag.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            var tagMenuValue = tagMenu.toString();

            if (!tagMenuValue === 'Heading 1'){
                throw new Error('Button is not active');
            }
        });
    </script>

    <div class="test-8">
        <h1>H1 Tag Button 8: Empty Selection at the Beginning of a Word in a Header H1</h1>
        <div class="test-input">
            <div class="editable">
                <h1>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada {}hendrerit velit nec tristique.
                </h1>
                <h2>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </h2>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <h1>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada {}hendrerit velit nec tristique.
                </h1>
                <h2>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </h2>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-8', function(input) {
            var tagMenu = clickButton(input, '.raptor-ui-tag-menu');
            var h1Tag = $('.raptor-ui-tag-menu-menu [data-value=h1]');
            h1Tag.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            var tagMenuValue = tagMenu.toString();

            if (!tagMenuValue === 'Heading 1'){
                throw new Error('Button is not active');
            }
        });
    </script>
</body>
</html>
