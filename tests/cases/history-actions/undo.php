<?php $i = 0; ?>
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

    <div class="test-<?= ++$i; ?>">
        <h1>Test <?= $i ?>: Undo once</h1>
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
        testEditor('.test-<?= $i ?>', function(input) {
            clickButton(input, '.raptor-ui-text-italic');
            clickButton(input, '.raptor-ui-text-bold');

            var undoButton = getLayoutElement(input).find('.raptor-ui-history-undo');
            var redoButton = getLayoutElement(input).find('.raptor-ui-history-redo');

            if (undoButton.is('.ui-state-disabled')) {
                throw new Error('Undo button is disabled (should be enabled)');
            }
            if (!redoButton.is('.ui-state-disabled')) {
                throw new Error('Redo button is not disabled (should be disabled)');
            }

            undoButton.trigger('click');

            if (undoButton.is('.ui-state-disabled')) {
                throw new Error('Undo button is disabled (should be enabled)');
            }
            if (redoButton.is('.ui-state-disabled')) {
                throw new Error('Redo button is disabled (should be enabled)');
            }
        });
    </script>

    <div class="test-<?= ++$i; ?>">
        <h1>Test <?= $i ?>: Undo twice</h1>
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
        testEditor('.test-<?= $i ?>', function(input) {
            clickButton(input, '.raptor-ui-text-italic');
            clickButton(input, '.raptor-ui-text-bold');

            var undoButton = getLayoutElement(input).find('.raptor-ui-history-undo');
            var redoButton = getLayoutElement(input).find('.raptor-ui-history-redo');

            if (undoButton.is('.ui-state-disabled')) {
                throw new Error('Undo button is disabled (should be enabled)');
            }
            if (!redoButton.is('.ui-state-disabled')) {
                throw new Error('Redo button is not disabled (should be disabled)');
            }

            undoButton.trigger('click');

            if (undoButton.is('.ui-state-disabled')) {
                throw new Error('Undo button is disabled (should be enabled)');
            }
            if (redoButton.is('.ui-state-disabled')) {
                throw new Error('Redo button is disabled (should be enabled)');
            }

            undoButton.trigger('click');

            if (!undoButton.is('.ui-state-disabled')) {
                throw new Error('Undo button is not disabled (should be disabled)');
            }
            if (redoButton.is('.ui-state-disabled')) {
                throw new Error('Redo button is disabled (should be enabled)');
            }
        });
    </script>
</body>
</html>
