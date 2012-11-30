<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
    <style type="text/css">
        .cms-red {
            color: red;
        }
        .cms-blue {
            color: blue;
        }
        .cms-bold {
            font-weight: bold;
        }
    </style>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();
        var redApplier = rangy.createCssClassApplier('cms-red', {
            elementTagName: 'color'
        });
        var blueApplier = rangy.createCssClassApplier('cms-blue', {
            elementTagName: 'color'
        });
        var remover = rangy.createApplier({
            tag: 'color',
            ignoreClasses: true
        });
    </script>
    <div class="test-1">
        <h1>Color 1: Normalise ranges custom tags</h1>
        <div class="test-input">
            <p>
                {This should be red {This should be red, then blue.} This should be blue.}
            </p>
        </div>
        <div class="test-expected">
            <p>
                <color class="cms-red">This should be red </color><color class="cms-blue">This should be red, then blue. This should be blue.</color>
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-1', function(input) {
            var ranges = tokensToRanges(input);
            redApplier.applyToRanges(ranges);
            ranges = tokensToRanges(input);
            remover.undoToRanges(ranges);
            blueApplier.applyToRanges(ranges);
        });
    </script>

    <div class="test-2">
        <h1>Color 2: Normalise generic tags</h1>
        <div class="test-input">
            <p>
                <span class="cms-bold">This should be bold. {This should be bold and blue.</span>
                This should be blue.}
            </p>
        </div>
        <div class="test-expected">
            <p>
                <span class="cms-bold">This should be bold. <span class="cms-blue">This should be bold and blue.</span></span><span class="cms-blue">
                This should be blue.</span>
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-2', function(input) {
            var ranges = tokensToRanges(input),
                applier = rangy.createApplier({
                    tag: 'span',
                    classes: ['cms-blue']
                });
            applier.applyToRanges(ranges);
        });
    </script>

    <div class="test-3">
        <h1>Color 3: Remove nested tags</h1>
        <div class="test-input">
            <p>
                {<span class="cms-bold">This should be normal. <span class="cms-blue">This should also be normal.</span></span>}
            </p>
        </div>
        <div class="test-expected">
            <p>
                This should be normal. This should also be normal.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-3', function(input) {
            var ranges = tokensToRanges(input),
                applier = rangy.createApplier({
                    tag: 'span'
                });
            applier.undoToRanges(ranges);
        });
    </script>

    <div class="test-4">
        <h1>Color 4: Remove multiple classes</h1>
        <div class="test-input">
            <p>
                {
                    <span class="cms-red">This was red, and now should be normal.</span>
                    <span class="cms-blue">This was blue, and now should be normal.</span>
                }
            </p>
        </div>
        <div class="test-expected">
            <p>
                This was red, and now should be normal.
                This was blue, and now should be normal.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-4', function(input) {
            var ranges = tokensToRanges(input),
                applier = rangy.createApplier({
                    tag: 'span'
                });
            applier.classes = ['cms-blue'];
            applier.undoToRanges(ranges);
            applier.classes = ['cms-red'];
            applier.undoToRanges(ranges);
        });
    </script>
</body>
</html>