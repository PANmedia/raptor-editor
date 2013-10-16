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

        function testLink(input) {
            var createLinkButton = getLayoutElement(input).find('.raptor-ui-link-create');
            var removeLinkButton = getLayoutElement(input).find('.raptor-ui-link-remove');

            createLinkButton.trigger('click');

            var linkType = $('.raptor-ui-link-create-menu');
            linkType.value = 0;

            var linkInput = document.getElementById('raptor-internal-href');
            linkInput.value = ".";

            var insertLinkButton = $('.raptor-ui-link-create-dialog button:contains(Insert Link)');
            insertLinkButton.trigger('click');

            rangesToTokens(rangy.getSelection().getAllRanges());

            if (!createLinkButton.is('.ui-state-highlight')){
                throw new Error('Create link button is not active');
            }
            if (!removeLinkButton.is('.ui-state-highlight')){
                throw new Error('Remove link button is not active');
            }
        }
    </script>
    <div class="test-<?= ++$i; ?>">
        <h1>Link Image <?= $i; ?></h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Top
                    {<img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />}
                    Bottom
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    Top
                    <a href=".">{<img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />}</a>
                    Bottom
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-<?= $i; ?>', testLink);
    </script>
    <?php return; ?>
    <div class="test-<?= ++$i; ?>">
        <h1>Link Image <?= $i; ?></h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    {<img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />}
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    <a href=".">{<img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />}</a>
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-<?= $i; ?>', testLink);
    </script>
</body>
</html>
