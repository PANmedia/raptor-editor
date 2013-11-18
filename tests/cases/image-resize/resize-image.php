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
        <h1>Resize Image 1: Resize Image - No Text</h1>
        <div class="test-input">
            <div class="editable">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" style="width: 40px; height: 50px;" />
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <img src="../../images/raptor.png" alt="raptor logo" height="80" width="60" style="width: 60px; height: 80px;" />
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            $(input).find('img').trigger('mouseenter');
            $('.raptor-plugin-image-resize-button-button').trigger('click');

            $('.raptor-plugin-image-resize-button-lock-proportions').trigger('click');

            $('#raptor-plugin-image-resize-button-width').val('60');
            $('#raptor-plugin-image-resize-button-height').val('80');

            $('.ui-dialog button:contains(Resize)').trigger('click');
        });
    </script>

    <div class="test-2">
        <h1>Resize Image 2: Resize Image With Text </h1>
        <div class="test-input">
            <div class="editable">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" style="width: 40px; height: 50px;" />
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <img src="../../images/raptor.png" alt="raptor logo" height="80" width="60" style="width: 60px; height: 80px;" />
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-2', function(input) {
            $(input).find('img').trigger('mouseenter');
            $('.raptor-plugin-image-resize-button-button').trigger('click');

            $('#raptor-plugin-image-resize-button-height').val('80');
            $('#raptor-plugin-image-resize-button-width').val('60');

            $('.ui-dialog button:contains(Resize)').trigger('click');
        });
    </script>

    <div class="test-3">
        <h1>Resize Image 3: Resize Image Just Width</h1>
        <div class="test-input">
            <div class="editable">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" style="width: 40px; height: 50px;" />
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="60" style="width: 60px; height: 50px;" />
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-3', function(input) {
            $(input).find('img').trigger('mouseenter');
            $('.raptor-plugin-image-resize-button-button').trigger('click');

            $('#raptor-plugin-image-resize-button-width').val('60');

            $('.ui-dialog button:contains(Resize)').trigger('click');
        });
    </script>

    <div class="test-4">
        <h1>Resize Image 4: Resize Image Just Height</h1>
        <div class="test-input">
            <div class="editable">
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" style="width: 40px; height: 50px;" />
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <img src="../../images/raptor.png" alt="raptor logo" height="80" width="40" style="width: 40px; height: 80px;" />
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-4', function(input) {
            $(input).find('img').trigger('mouseenter');
            $('.raptor-plugin-image-resize-button-button').trigger('click');

            $('#raptor-plugin-image-resize-button-height').val('80');

            $('.ui-dialog button:contains(Resize)').trigger('click');
        });
    </script>

</body>
</html>
