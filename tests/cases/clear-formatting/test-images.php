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
    <div class="test-<?= ++$i ?>">
        <h1>Clear Formatting Button <?= $i ?>: Basic</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Test {paragraph 1 start.
                    <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" class="cms-float-right" />
                    Test paragraph} 1 end.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    Test {paragraph 1 start.
                    <img src="../../images/raptor.png" alt="raptor logo" />
                    Test paragraph} 1 end.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-<?= $i ?>', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Clear Formatting Button <?= $i ?>: Image Float</h1>
        <div class="test-input">
            <div class="editable">
                {<img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" class="cms-float-right" />}
                <div style="clear: both"></div>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                {<img src="../../images/raptor.png" alt="raptor logo" />}
                <div style="clear: both"></div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-<?= $i ?>', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Clear Formatting Button <?= $i ?>: Image Float and text and alignment</h1>
        <div class="test-input">
            <div class="editable">
                <p class="cms-right">
                    {Some text that can be <strong class="cms-bold">bold</strong> and <span class="cms-underline">underlined</span> and <em class="cms-italic">italic</em> as
                    well as being right aligned before clearing the formatting.
                </p>
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" class="cms-float-right"  />}
                    <div style="clear: both">
                    </div>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                {
                <p>
                    Some text that can be bold and underlined and italic as
                    well as being right aligned before clearing the formatting.
                </p>
                <img src="../../images/raptor.png" alt="raptor logo"  />
                }
                <div style="clear: both"></div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-<?= $i ?>', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>
</body>
</html>
