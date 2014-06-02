<?php $i = 0 ?>
<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();

        function testSelectExpand(input) {
            var ranges = tokensToRanges(input);
            rangy.getSelection().setRanges(ranges);
            selectionExpandToWord();
            rangesToTokens(rangy.getSelection().getAllRanges());
        }
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Test <?= $i ?></h1>
        <div class="test-input">
            <p>
                Loooooooooooo{}ooooooong
            </p>
        </div>
        <div class="test-expected">
            <p>
                {Looooooooooooooooooong}
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', testSelectExpand);
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Test <?= $i ?></h1>
        <div class="test-input">
            <div>
                Above
                <p>
                    {}
                </p>
                Below
            </div>
        </div>
        <div class="test-expected">
            <div>
                Above
                <p>
                    {}
                </p>
                Below
            </div>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', testSelectExpand);
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Test <?= $i ?></h1>
        <div class="test-input">
            <div>
                <p>Before{}</p>
                <p>After</p>
            </div>
        </div>
        <div class="test-expected">
            <div>
                <p>{Before}</p>
                <p>After</p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', testSelectExpand);
    </script>

</body>
</html>