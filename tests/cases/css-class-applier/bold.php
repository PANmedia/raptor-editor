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
    </script>
    <div class="test-<?= ++$i ?>">
        <h1>Bold <?= $i ?>: Word Group Selection</h1>
        <div class="test-input">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                convallis {dui id erat pellentesque et rhoncus} nunc semper. Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </p>
        </div>
        <div class="test-expected">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                convallis <strong class="cms-bold">dui id erat pellentesque et rhoncus</strong> nunc semper. Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', function(input) {
            var ranges = tokensToRanges(input);
            for (var i = 0; i < ranges.length; i++) {
                rangeTrim(ranges[i]);
            }
            applier.applyToRanges(ranges);
        });
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Bold <?= $i ?>: Word Part Selection</h1>
        <div class="test-input">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                convallis dui id erat {pellentes}que et rhoncus nunc semper. Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </p>
        </div>
        <div class="test-expected">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                convallis dui id erat <strong class="cms-bold">pellentes</strong>que et rhoncus nunc semper. Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', function(input) {
            var ranges = tokensToRanges(input);
            for (var i = 0; i < ranges.length; i++) {
                rangeTrim(ranges[i]);
            }
            applier.applyToRanges(ranges);
        });
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Bold <?= $i ?>: Full Word Selection</h1>
        <div class="test-input">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula {venenatis} rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </p>
        </div>
        <div class="test-expected">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula <strong class="cms-bold">venenatis</strong> rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', function(input) {
            var ranges = tokensToRanges(input);
            for (var i = 0; i < ranges.length; i++) {
                rangeTrim(ranges[i]);
            }
            applier.applyToRanges(ranges);
        });
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Bold <?= $i ?>: Multi Paragraph Selection</h1>
        <div class="test-input">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                convallis dui id {erat pellentesque et rhoncus nunc semper.
            </p>
            <p>
                Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam} gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </p>
        </div>
        <div class="test-expected">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                convallis dui id <strong class="cms-bold">erat pellentesque et rhoncus nunc semper.
            </strong></p>
            <p><strong class="cms-bold">
                Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam</strong> gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', function(input) {
            var ranges = tokensToRanges(input);
            for (var i = 0; i < ranges.length; i++) {
                rangeTrim(ranges[i]);
            }
            applier.applyToRanges(ranges);
        });
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Bold <?= $i ?>: Paragraph Selection</h1>
        <div class="test-input">
            <p>
                {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                convallis dui id erat pellentesque et rhoncus nunc semper.
            </p>
            <p>
                Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.}
            </p>
        </div>
        <div class="test-expected">
            <p>
                <strong class="cms-bold">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                convallis dui id erat pellentesque et rhoncus nunc semper.
            </strong></p>
            <p><strong class="cms-bold">
                Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.</strong>
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', function(input) {
            var ranges = tokensToRanges(input);
            for (var i = 0; i < ranges.length; i++) {
                rangeTrim(ranges[i]);
            }
            applier.applyToRanges(ranges);
        });
    </script>

    <div class="test-<?= ++$i ?>">
        <h1>Bold <?= $i ?>: Contain Wrapper</h1>
        <div class="test-input">{}</div>
        <div class="test-expected">
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i ?>', function(input) {
            var ranges = tokensToRanges(input);
            for (var i = 0; i < ranges.length; i++) {
                rangeTrim(ranges[i]);
            }
            applier.applyToRanges(ranges);
        });
    </script>
</body>
</html>