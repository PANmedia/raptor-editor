<?php $i = 0; ?>
<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();

        function testSelectExpandTo(selector, limit, outer) {
            return function(input) {
                var ranges = tokensToRanges(input);
                rangy.getSelection().setRanges(ranges);
                selectionExpandTo(selector, limit, outer);
                rangesToTokens(rangy.getSelection().getAllRanges());
            };
        }
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Test <?= $i ?></h1>
        <div class="test-input">
            <p>
                <a href=".">This is {paragraph} 1.</a>
            </p>
        </div>
        <div class="test-expected">
            <p>
                <a href=".">{This is paragraph 1.}</a>
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', testSelectExpandTo('a'));
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Test <?= $i ?></h1>
        <div class="test-input">
            <p>
                <a href=".">This is {paragraph 1.</a>
                This is line} 2.
            </p>
        </div>
        <div class="test-expected">
            <p>
                <a href=".">{This is paragraph 1.</a>
                This is line} 2.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', testSelectExpandTo('a'));
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Test <?= $i ?></h1>
        <div class="test-input">
            <p>
                This is {paragraph} 1.
            </p>
        </div>
        <div class="test-expected">
            <p>
                This is {paragraph} 1.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', testSelectExpandTo('a'));
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Test <?= $i ?></h1>
        <div class="test-input">
            <div class="target">
                Above.
                <div class="limit">
                    This is {paragraph} 1.
                </div>
                Below.
            </div>
        </div>
        <div class="test-expected">
            <div class="target">
                Above.
                <div class="limit">
                    This is {paragraph} 1.
                </div>
                Below.
            </div>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', testSelectExpandTo('.target', '.limit'));
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Test <?= $i ?></h1>
        <div class="test-input">
            <div class="limit">
                Above.
                <div class="target">
                    This is {paragraph} 1.
                </div>
                Below.
            </div>
        </div>
        <div class="test-expected">
            <div class="limit">
                Above.
                <div class="target">
                    {This is paragraph 1.}
                </div>
                Below.
            </div>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', testSelectExpandTo('.target', '.limit'));
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Test <?= $i ?></h1>
        <div class="test-input">
            <div class="limit">
                Above.
                <div class="target">
                    Outer above.
                    <div class="target">
                        Inner {content is} here.
                    </div>
                    Outer below.
                </div>
                Below.
            </div>
        </div>
        <div class="test-expected">
            <div class="limit">
                Above.
                <div class="target">
                    Outer above.
                    <div class="target">
                        {Inner content is here.}
                    </div>
                    Outer below.
                </div>
                Below.
            </div>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', testSelectExpandTo('.target', '.limit'));
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Test <?= $i ?></h1>
        <div class="test-input">
            <div class="limit">
                Above.
                <div class="target" data-level="1">
                    Level 1 above.
                    <div class="target" data-level="2">
                        Level 2 above.
                        <div class="target" data-level="3">
                            Level 3 above.
                            <div class="target" data-level="4">
                                Inner {content is} here.
                            </div>
                            Level 3 below.
                        </div>
                        Level 2 below.
                    </div>
                    Level 1 below.
                </div>
                Below.
            </div>
        </div>
        <div class="test-expected">
            <div class="limit">
                Above.
                <div class="target" data-level="1">
                    {Level 1 above.
                    <div class="target" data-level="2">
                        Level 2 above.
                        <div class="target" data-level="3">
                            Level 3 above.
                            <div class="target" data-level="4">
                                Inner content is here.
                            </div>
                            Level 3 below.
                        </div>
                        Level 2 below.
                    </div>
                    Level 1 below.}
                </div>
                Below.
            </div>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', testSelectExpandTo('.target', '.limit', true));
    </script>

</body>
</html>