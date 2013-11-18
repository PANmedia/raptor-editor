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
        <h1>Cancel Resize Image 1: Cancel resize.</h1>
        <div class="test-input">
            <div class="editable">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" style="width: 40px; height: 50px;" />
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" style="width: 40px; height: 50px;" />
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            $(input).find('img').trigger('mouseenter');
            $('.raptor-image-resize-button-button').trigger('click');

            $('#raptor-image-resize-button-height').val('80');
            $('#raptor-image-resize-button-width').val('60');

            $('.ui-dialog button:contains(Cancel)').trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

</body>
</html>
