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
        <h1>Rangy Applier 1: Apply single tag/class to range</h1>
        <div class="test-input">
            {Lorem ipsum dolor sit amet.}
        </div>
        <div class="test-expected">
            <p class="bold">
                Lorem ipsum dolor sit amet.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-1', function(input) {
            var applier = rangy.createApplier({
                tag: 'p',
                classes: ['bold']
            });
            var ranges = tokensToRanges(input);
            applier.toggleRanges(ranges);
        });
    </script>

    <div class="test-2">
        <h1>Rangy Applier 2: Undo single tag/class to range</h1>
        <div class="test-input">
            <div>
                {<p class="bold">Lorem ipsum dolor sit amet.</p>}
            </div>
        </div>
        <div class="test-expected">
            <div>
                Lorem ipsum dolor sit amet.
            </div>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-2', function(input) {
            var applier = rangy.createApplier({
                tag: 'p',
                classes: ['bold']
            });
            var ranges = tokensToRanges(input);
            applier.toggleRanges(ranges);
        });
    </script>

    <div class="test-3">
        <h1>Rangy Applier 3: Add class to existing tag</h1>
        <div class="test-input">
            {<p class="bold">Lorem ipsum dolor sit amet.</p>}
        </div>
        <div class="test-expected">
            <p class="bold italic">Lorem ipsum dolor sit amet.</p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-3', function(input) {
        var applier = rangy.createApplier({
            tag: 'p',
            classes: ['italic']
        });
            var ranges = tokensToRanges(input);
            applier.toggleRanges(ranges);
        });
    </script>

    <div class="test-4">
        <h1>Rangy Applier 4: Add multiple classes to existing tag</h1>
        <div class="test-input">
            {<p>Lorem ipsum dolor sit amet.</p>}
        </div>
        <div class="test-expected">
            <p class="bold italic">Lorem ipsum dolor sit amet.</p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-4', function(input) {
            var applier = rangy.createApplier({
                tag: 'p',
                classes: ['bold', 'italic']
            });
            var ranges = tokensToRanges(input);
            applier.toggleRanges(ranges);
        });
    </script>
</body>
</html>