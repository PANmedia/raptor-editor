<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
    <?php $uri = '../../../src/'; include '../../../src/include.php'; ?>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();
    </script>
    <div class="test-1">
        <h1>Left Float Button 1: Enabled When Image Clicked On</h1>
        <div class="test-input">
            <div class="editible">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />
                <p>
                    Some text here
                </p>
                <div style="clear: both">
                </div>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" class="cms-float-left"/>
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
            input.find('.editible').data('editor').getLayout().getElement().find('.raptor-ui-float-left').trigger('click');
        });
    </script>
    
    <div class="test-2">
        <h1>Right Float Button 1: Enabled When Image Clicked On </h1>
        <div class="test-input">
            <div class="editible">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />
                <p>
                    Some text here
                </p>
                <div style="clear: both">
                </div>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" class="cms-float-right" />
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
            input.find('.editible').data('editor').getLayout().getElement().find('.raptor-ui-float-right').trigger('click');
        });
    </script>
    
     <div class="test-3">
        <h1>No Float Button 1: Enabled When Image Clicked On </h1>
        <div class="test-input">
            <div class="editible">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" class="cms-float-left"/>
                <p>
                    Some text here
                </p>
                <div style="clear: both">
                </div>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
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
            input.find('.editible').data('editor').getLayout().getElement().find('.raptor-ui-float-none').trigger('click');
        });
    </script>
</body>
</html>