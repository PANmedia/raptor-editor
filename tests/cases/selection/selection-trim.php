<?php $i = 0 ?>
<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();

        function testSelectionTrim(input) {
            var ranges = tokensToRanges(input);
            rangy.getSelection().setRanges(ranges);
            selectionTrim();
            rangesToTokens(rangy.getSelection().getAllRanges());
        }
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Test <?= $i ?></h1>
        <div class="test-input">
            <p>
                Some{ cool }words.
            </p>
        </div>
        <div class="test-expected">
            <p>
                Some {cool} words.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', testSelectionTrim);
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Test <?= $i ?></h1>
        <div class="test-input">
            <p>
                Some{ &nbsp; null spaces &nbsp; }words.
            </p>
        </div>
        <div class="test-expected">
            <p>
                Some &nbsp; {null spaces} &nbsp; words.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', testSelectionTrim);
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Test <?= $i ?></h1>
        <div class="test-input">
            <p>Some{ </p>
            <p> }paragraphs.</p>
        </div>
        <div class="test-expected">
            <p>Some {</p>
            <p>} paragraphs.</p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', testSelectionTrim);
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Test <?= $i ?></h1>
        <div class="test-input">
            <p>
                Some{ <img src="../../images/raptor.png" width="20" /> }image.
            </p>
        </div>
        <div class="test-expected">
            <p>
                Some {<img src="../../images/raptor.png" width="20" />} image.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', testSelectionTrim);
    </script>

</body>
</html>