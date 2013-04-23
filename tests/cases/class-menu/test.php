<?php $i = 0 ?>
<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
    <?php $uri = '../../../src/'; include '../../../src/include.php'; ?>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();
    </script>
    <div class="test-<?= ++$i ?>">
        <h1>Test <?= $i ?></h1>
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
                <p class="cms-blue-bg">
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
            var classMenu = getLayoutElement(input).find('.raptor-ui-class-menu');
            classMenu.trigger('click');
            var blueBackgroundTag = $('.raptor-ui-class-menu-menu [data-value=cms-blue-bg]');
            blueBackgroundTag.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            var classMenuValue = classMenu.toString();
            if (!classMenuValue === 'Blue background'){
                throw new Error('Button is not active');
            }
        });
    </script>
</body>
</html>
