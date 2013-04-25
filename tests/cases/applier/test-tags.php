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
    </style>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();
    </script>
    <div class="test-1">
        <h1>Rangy Applier 1: Apply single tag to range</h1>
        <div class="test-input">
            {Lorem ipsum dolor sit amet.}
        </div>
        <div class="test-expected">
            <custom>Lorem ipsum dolor sit amet.</custom>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-1', function(input) {
            var applier = rangy.createApplier({
                tag: 'custom'
            });
            var ranges = tokensToRanges(input);
            applier.toggleRanges(ranges);
        });
    </script>

    <div class="test-2">
        <h1>Rangy Applier 2: Undo single tag to multiple ranges</h1>
        <div class="test-input">
            {<div>Lorem ipsum dolor sit amet.</div>}
            <div>{Lorem ipsum dolor sit amet.</div>}
            {<div>Lorem ipsum dolor sit amet.}</div>
            <div>{Lorem ipsum dolor sit amet.}</div>
        </div>
        <div class="test-expected">
            Lorem ipsum dolor sit amet.
            Lorem ipsum dolor sit amet.
            Lorem ipsum dolor sit amet.
            Lorem ipsum dolor sit amet.
        </div>
    </div>
    <script type="text/javascript">
        test('.test-2', function(input) {
            var applier = rangy.createApplier({
                tag: 'div'
            });
            var ranges = tokensToRanges(input);
            applier.undoToRanges(ranges);
        });
    </script>

    <div class="test-3">
        <h1>Rangy Applier 3: Toggle multiple ranges</h1>
        <div class="test-input">
            {Test element 1}
        </div>
        <div class="test-expected">
            <p>Test element 1</p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-3', function(input) {
            var applier = rangy.createApplier({
                tag: 'p'
            });
            var ranges = tokensToRanges(input);
            applier.toggleRanges(ranges);
        });
    </script>
</body>
</html>