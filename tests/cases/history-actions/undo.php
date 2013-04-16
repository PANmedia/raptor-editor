<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
    <?php $uri = '../../../src/'; include __DIR__ . '/../../../src/include.php'; ?>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();
    </script>

    <div class="test-1">
        <h1>Italic Button 1: Word Group Selection</h1>
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
                    convallis <em class="cms-italic">dui id erat pellentesque et rhoncus</em> nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            clickButton(input, '.raptor-ui-text-italic');
            clickButton(input, '.raptor-ui-text-bold');

            var undoButton = getLayoutElement(input).find('.raptor-ui-history-undo');
            undoButton.trigger('click');

            var redoButton = getLayoutElement(input).find('.raptor-ui-history-redo');

            if (undoButton.is('.ui-state-highlight')) {
                throw new Error('Undo button is active');
            }
            if (!redoButton.is('.ui-state-highlight')) {
                throw new Error('Redo button is not active');
            }

        });
    </script>

    <div class="test-2">
        <h1>Italic Button 2: Word Group Selection</h1>
        <div class="test-input">
            <div class="editable">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" style="width: 40px; height: 50px;" />
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" style="width: 40px; height: 50px;" />
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-2', function(input) {
            $(input).find('img').trigger('mouseenter');
            $('.raptor-image-resize-button-button').trigger('click');

            $('#raptor-image-resize-button-width').val('60');
            $('#raptor-image-resize-button-height').val('80');

            $('.ui-dialog button:contains(Resize)').trigger('click');

            var undoButton = getLayoutElement(input).find('.raptor-ui-history-undo');
            undoButton.trigger('click');

            var redoButton = getLayoutElement(input).find('.raptor-ui-history-redo');

            if (undoButton.is('.ui-state-highlight')) {
                throw new Error('Undo button is active');
            }
            if (!redoButton.is('.ui-state-highlight')) {
                throw new Error('Redo button is not active');
            }

        });
    </script>

</body>
</html>
