<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
    <?php include __DIR__ . '/../../include.php'; ?>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();
    </script>
    <div class="test-1">
        <h1>Left Float Button 1: Enabled When Image Clicked On</h1>
        <div class="test-input">
            <div class="editable">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />
                <p>
                    Some text here
                </p>
                <div style="clear: both">
                </div>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                {<img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" class="cms-float-left"/>}
                <p>
                    Some text here
                </p>
                <div style="clear: both">
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            input.find('img').trigger('click');
            clickButton(input, '.raptor-ui-float-left');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-2">
        <h1>Right Float Button 1: Enabled When Image Clicked On </h1>
        <div class="test-input">
            <div class="editable">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />
                <p>
                    Some text here
                </p>
                <div style="clear: both">
                </div>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                {<img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" class="cms-float-right" />}
                <p>
                    Some text here
                </p>
                <div style="clear: both">
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-2', function(input) {
            input.find('img').trigger('click');
            clickButton(input, '.raptor-ui-float-right');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

     <div class="test-3">
        <h1>No Float Button 1: Enabled When Image Clicked On </h1>
        <div class="test-input">
            <div class="editable">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" class="cms-float-left"/>
                <p>
                    Some text here
                </p>
                <div style="clear: both">
                </div>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />
                <p>
                    Some text here
                </p>
                <div style="clear: both">
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-3', function(input) {
            input.find('img').trigger('click');
            clickButton(input, '.raptor-ui-float-none');
        });
    </script>
</body>
</html>
