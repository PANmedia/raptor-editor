<?php $i = 0; ?>
<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();
        var applier = rangy.createCssClassApplier('cms-bold', {
            elementTagName: 'strong'
        });
        function testIsApplied(input) {
            var ranges = tokensToRanges(input);
            if (!applier.isAppliedToRange(ranges[0])) {
                throw new Error('Class is not applied to range, when it should be.');
            }
        }
        function testIsNotApplied(input) {
            var ranges = tokensToRanges(input);
            if (applier.isAppliedToRange(ranges[0])) {
                throw new Error('Class is applied to range, when it should not be.');
            }
        }
    </script>
    <div class="test-<?= ++$i ?>">
        <h1>Is Applied <?= $i ?></h1>
        <div class="test-input">
            <p>
                {Test}
            </p>
        </div>
        <div class="test-expected">
            <p>
                Test
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', testIsNotApplied);
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Is Applied <?= $i ?></h1>
        <div class="test-input">
            <p>
                <strong class="cms-bold">{Test}</strong>
            </p>
        </div>
        <div class="test-expected">
            <p>
                <strong class="cms-bold">Test</strong>
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', testIsApplied);
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Is Applied <?= $i ?></h1>
        <div class="test-input">
            <p>
                {}
            </p>
        </div>
        <div class="test-expected">
            <p>
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', testIsNotApplied);
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Is Applied <?= $i ?></h1>
        <div class="test-input">
            <p>
                {    }
            </p>
        </div>
        <div class="test-expected">
            <p>
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', testIsNotApplied);
    </script>
</body>
</html>