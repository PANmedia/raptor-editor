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
        <h1>Rangy Applier - Attributes 1: Apply single attribute to range</h1>
        <div class="test-input">
            {Lorem ipsum dolor sit amet.}
        </div>
        <div class="test-expected">
            <span title="Rangy is awesome!">Lorem ipsum dolor sit amet.</span>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-1', function(input) {
            var applier = rangy.createApplier({
                tag: 'span',
                attributes: {
                    title: 'Rangy is awesome!'
                }
            });
            var ranges = tokensToRanges(input);
            applier.toggleRanges(ranges);
        });
    </script>
    
    <div class="test-2">
        <h1>Rangy Applier - Attributes 2: Undo single attribute to range</h1>
        <div class="test-input">
            <span title="Rangy is awesome!">{Lorem ipsum dolor sit amet.}</span>
        </div>
        <div class="test-expected">
            <span>Lorem ipsum dolor sit amet.</span>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-2', function(input) {
            var applier = rangy.createApplier({
                attributes: {
                    title: 'Rangy is awesome!'
                }
            });
            var ranges = tokensToRanges(input);
            applier.undoToRanges(ranges);
        });
    </script>

    <div class="test-3">
        <h1>Rangy Applier - Attributes 3</h1>
        <div class="test-input">
            <a href="/">{Lorem ipsum dolor sit amet.}</a>
        </div>
        <div class="test-expected">
            <a href="http://www.google.com">Lorem ipsum dolor sit amet.</a>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-3', function(input) {
            var applier = rangy.createApplier({
                tag: 'a',
                attributes: {
                    href: 'http://www.google.com'
                }
            });
            var ranges = tokensToRanges(input);
            applier.applyToRanges(ranges);
        });
    </script>
</body>
</html>