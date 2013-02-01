<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();
        var applier;
        applier = rangy.createApplier({
            tag: 'a',
            attributes: {
                href: '/'
            }
        });
    </script>
    <div class="test-1">
        <h1>Rangy Applier 1</h1>
        <div class="test-input">
            {<img src="../../../example/full-suite/images/orange.jpg" />}
        </div>
        <div class="test-expected">
            <a href="/"><img src="../../../example/full-suite/images/orange.jpg" /></a>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-1', function(input) {
            var ranges = tokensToRanges(input);
            applier.toggleRanges(ranges);
        });
    </script>

    <div class="test-2">
        <h1>Rangy Applier 2</h1>
        <div class="test-input">
            {Some text <img src="../../../example/full-suite/images/orange.jpg" /> and here}
        </div>
        <div class="test-expected">
            <a href="/">Some text <img src="../../../example/full-suite/images/orange.jpg" /> and here</a>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-2', function(input) {
            var ranges = tokensToRanges(input);
            applier.toggleRanges(ranges);
        });
    </script>

    <div class="test-3">
        <h1>Rangy Applier 3</h1>
        <div class="test-input">
            <a href="/">{<img src="../../../example/full-suite/images/orange.jpg" />}</a>
        </div>
        <div class="test-expected">
            <img src="../../../example/full-suite/images/orange.jpg" />
        </div>
    </div>
    <script type="text/javascript">
        test('.test-3', function(input) {
            var ranges = tokensToRanges(input);
            applier.toggleRanges(ranges);
        });
    </script>
    
    <div class="test-4">
        <h1>Rangy Applier 4</h1>
        <div class="test-input">
            {Some text <span>test</span> and here}
        </div>
        <div class="test-expected">
            <a href="/">Some text <span>test</span> and here</a>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-4', function(input) {
            var ranges = tokensToRanges(input);
            applier.toggleRanges(ranges);
        });
    </script>

    <div class="test-5">
        <h1>Rangy Applier 5</h1>
        <div class="test-input">
            {Some text and here}
        </div>
        <div class="test-expected">
            <a href="/">Some text and here</a>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-5', function(input) {
            var ranges = tokensToRanges(input);
            applier.toggleRanges(ranges);
        });
    </script>
</body>
</html>