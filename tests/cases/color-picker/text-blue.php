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
        <h1>Text Blue Button 1: Word Group Selection</h1>
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
                    convallis <span class="cms-color cms-blue">{dui id erat pellentesque et rhoncus}</span> nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            var colorMenuBasic = getLayoutElement(input).find('.raptor-ui-color-menu-basic');
            colorMenuBasic.trigger('click');
            var blue = $('.raptor-ui-color-menu-basic-menu:eq(0) [data-color=blue]');
            blue.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            var colorMenuBasicValue = colorMenuBasic.toString();

            if (!colorMenuBasicValue === 'Blue'){
                throw new Error('Button is not active');
            }
        });
    </script>

    <div class="test-2">
        <h1>Text Blue Button 2: Single Word Selection</h1>
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
                    Lorem ipsum dolor sit amet, consectetur <span class="cms-color cms-blue">{adipiscing}</span> elit. Maecenas
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
            var colorMenuBasic = getLayoutElement(input).find('.raptor-ui-color-menu-basic');
            colorMenuBasic.trigger('click');
            var blue = $('.raptor-ui-color-menu-basic-menu:eq(1) [data-color=blue]');
            blue.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            var colorMenuBasicValue = colorMenuBasic.toString();

            if (!colorMenuBasicValue === 'Blue'){
                throw new Error('Button is not active');
            }
        });
    </script>

    <div class="test-3">
        <h1>Text Blue Button 3: Part Word Selection</h1>
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
                    convallis dui id erat pel<span class="cms-color cms-blue">{lentesqu}</span>e et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-3', function(input) {
            var colorMenuBasic = getLayoutElement(input).find('.raptor-ui-color-menu-basic');
            colorMenuBasic.trigger('click');
            var blue = $('.raptor-ui-color-menu-basic-menu:eq(2) [data-color=blue]');
            blue.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            var colorMenuBasicValue = colorMenuBasic.toString();

            if (!colorMenuBasicValue === 'Blue'){
                throw new Error('Button is not active');
            }
        });
    </script>

     <div class="test-4">
        <h1>Text Blue Button 4: Multi-Paragraph Selection</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui {id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p>
                <p>
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
                    convallis dui <span class="cms-color cms-blue">{id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </span></p>
                <p><span class="cms-color cms-blue">
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse}</span> interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-4', function(input) {
            var colorMenuBasic = getLayoutElement(input).find('.raptor-ui-color-menu-basic');
            colorMenuBasic.trigger('click');
            var blue = $('.raptor-ui-color-menu-basic-menu:eq(3) [data-color=blue]');
            blue.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            var colorMenuBasicValue = colorMenuBasic.toString();

            if (!colorMenuBasicValue === 'Blue'){
                throw new Error('Button is not active');
            }
        });
    </script>

    <div class="test-5">
        <h1>Text Blue Button 5: Paragraph Selection</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p><p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.}
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    <span class="cms-color cms-blue">{Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </span></p>
                <p><span class="cms-color cms-blue">
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.}</span>
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-5', function(input) {
            var colorMenuBasic = getLayoutElement(input).find('.raptor-ui-color-menu-basic');
            colorMenuBasic.trigger('click');
            var blue = $('.raptor-ui-color-menu-basic-menu:eq(4) [data-color=blue]');
            blue.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            var colorMenuBasicValue = colorMenuBasic.toString();

            if (!colorMenuBasicValue === 'Blue'){
                throw new Error('Button is not active');
            }
        });
    </script>

    <div class="test-6">
        <h1>Text Blue Button 6: Empty Selection in Word</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p><p>
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
                </p><p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. <span class="cms-color cms-blue">{Suspendisse}</span> interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-6', function(input) {
            var colorMenuBasic = getLayoutElement(input).find('.raptor-ui-color-menu-basic');
            colorMenuBasic.trigger('click');
            var blue = $('.raptor-ui-color-menu-basic-menu:eq(5) [data-color=blue]');
            blue.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            var colorMenuBasicValue = colorMenuBasic.toString();

            if (!colorMenuBasicValue === 'Blue'){
                throw new Error('Button is not active');
            }
        });
    </script>
</body>
</html>
