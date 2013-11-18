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
        <h1>Placeholder 1: Empty content replacement</h1>
        <div class="test-input">
            <div class="editable">

            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    [Your content here]
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            if (!getRaptor(input).getHtml().trim() === ''){
                throw new Error('Placeholder did not update content');
            }
        });
    </script>
</body>
</html>



