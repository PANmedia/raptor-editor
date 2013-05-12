<?php $i = 0; ?>
<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();

        function testSwapTags(input) {
            var ranges = tokensToRanges(input);
            rangy.getSelection().setRanges(ranges);
            selectionChangeTags('h1', [
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'p', 'div', 'pre', 'address'
            ], input.find('.limit'));
            rangesToTokens(rangy.getSelection().getAllRanges());
        }
    </script>

    <div class="test-<?= ++$i; ?>">
        <h1>Test <?= $i; ?></h1>
        <div class="test-input">
            <div class="limit">
                <p>
                    This is a paragraph.
                    {It has some content.}
                    Isn't it wonderful?
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="limit">
                <h1>
                    This is a paragraph.
                    {It has some content.}
                    Isn't it wonderful?
                </h1>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i; ?>', testSwapTags);
    </script>

    <div class="test-<?= ++$i; ?>">
        <h1>Test <?= $i; ?></h1>
        <div class="test-input">
            <div class="limit">
                <p>
                    <span class="cms-red">
                        This is a paragraph.
                        {It has some content.}
                        Isn't it wonderful?
                    </span>
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="limit">
                <h1>
                    <span class="cms-red">
                        This is a paragraph.
                        {It has some content.}
                        Isn't it wonderful?
                    </span>
                </h1>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i; ?>', testSwapTags);
    </script>

    <div class="test-<?= ++$i; ?>">
        <h1>Test <?= $i; ?>: Blockquote</h1>
        <div class="test-input">
            <div class="limit">
                <p>
                    This is a {paragraph.
                </p>
                <blockquote>
                    <p>
                        It has some content.
                    </p>
                </blockquote>
                <p>
                    Isn't} it wonderful?
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="limit">
                <h1>
                    This is a {paragraph.
                </h1>
                <blockquote>
                    <h1>
                        It has some content.
                    </h1>
                </blockquote>
                <h1>
                    Isn't} it wonderful?
                </h1>
            </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i; ?>', testSwapTags);
    </script>

    <div class="test-<?= ++$i; ?>">
        <h1>Test <?= $i; ?></h1>
        <div class="test-input">
            <div class="limit">
                <p>
                    This is a paragraph.
                    It has s{}ome content.
                    Isn't it wonderful?
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="limit">
                <h1>
                    This is a paragraph.
                    It has s{}ome content.
                    Isn't it wonderful?
                </h1>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i; ?>', testSwapTags);
    </script>

    <div class="test-<?= ++$i; ?>">
        <h1>Test <?= $i; ?></h1>
        <div class="test-input">
            <div class="limit">
                This is a par{agraph.
                It has some co}ntent.
                Isn't it wonderful?
            </div>
        </div>
        <div class="test-expected">
            <div class="limit">
                <h1>
                    This is a par{agraph.
                    It has some co}ntent.
                    Isn't it wonderful?
                </h1>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i; ?>', testSwapTags);
    </script>

    <div class="test-<?= ++$i; ?>">
        <h1>Test <?= $i; ?></h1>
        <div class="test-input">
            <div class="limit">
                <p>
                    This is {paragraph} 1.
                </p>
                <p>
                    This is paragraph 2.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="limit">
                <h1>
                    This is {paragraph} 1.
                </h1>
                <p>
                    This is paragraph 2.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i; ?>', testSwapTags);
    </script>

    <div class="test-<?= ++$i; ?>">
        <h1>Test <?= $i; ?></h1>
        <div class="test-input">
            <div class="limit">
                <p>
                    This is paragraph 1.
                </p>
                <p>
                    This is {paragraph 2.
                </p>
                <p>
                    This is paragraph} 3.
                </p>
                <p>
                    This is paragraph 4.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="limit">
                <p>
                    This is paragraph 1.
                </p>
                <h1>
                    This is {paragraph 2.
                </h1>
                <h1>
                    This is paragraph} 3.
                </h1>
                <p>
                    This is paragraph 4.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i; ?>', testSwapTags);
    </script>

    <div class="test-<?= ++$i; ?>">
        <h1>Test <?= $i; ?></h1>
        <div class="test-input">
            <div class="limit">
                <p>
                    This is {paragraph 1.
                </p>
                <blockquote>
                    <p>
                        This is paragraph} 2.
                    </p>
                </blockquote>
                <p>
                    This is paragraph 3.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="limit">
                <h1>
                    This is {paragraph 1.
                </h1>
                <blockquote>
                    <h1>
                        This is paragraph} 2.
                    </h1>
                </blockquote>
                <p>
                    This is paragraph 3.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i; ?>', testSwapTags);
    </script>

    <div class="test-<?= ++$i; ?>">
        <h1>Test <?= $i; ?>: HTML comment/div wrapper</h1>
        <div class="test-input">
            <div class="limit">
                <div>
                    <h1>{Editable} Block</h1>
                    <p>Click to edit</p>
                </div><!-- xmod-cms-block demo-editable-block-1:Raptor: -->
            </div>
        </div>
        <div class="test-expected">
            <div class="limit">
                <div>
                    <h1>{Editable} Block</h1>
                    <p>Click to edit</p>
                </div><!-- xmod-cms-block demo-editable-block-1:Raptor: -->
            </div>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i; ?>', testSwapTags);
    </script>

    <div class="test-<?= ++$i; ?>">
        <h1>Test <?= $i; ?>: Multi wrapper</h1>
        <div class="test-input">
            <div class="limit">
                <div>
                    <div>
                        <h2>{Editable} Block</h2>
                        <p>Click to edit</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="test-expected">
            <div class="limit">
                <div>
                    <div>
                        <h1>{Editable} Block</h1>
                        <p>Click to edit</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i; ?>', testSwapTags);
    </script>
</body>
</html>