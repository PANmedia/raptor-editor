<?php $i = 0; ?>
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
    <div class="test-<?= ++$i; ?>">
        <h1>Rangy Applier: Link Image <?= $i; ?></h1>
        <div class="test-input">
            {<img src="../../images/raptor.png" />}
        </div>
        <div class="test-expected">
            <a href="#test">
                <img src="../../images/raptor.png" />
            </a>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-<?= $i; ?>', function(input) {
            var applier = rangy.createApplier({
                tag: 'a',
                attributes: {
                    href: '#test'
                }
            });
            var ranges = tokensToRanges(input);
            applier.toggleRanges(ranges);
        });
    </script>
</body>
</html>