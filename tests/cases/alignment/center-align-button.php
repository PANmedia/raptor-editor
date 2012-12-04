<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
    <?php $uri = '../../../src/'; include __DIR__ . '/../../../src/include.php'; ?>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();
    </script>
    <div class="test-1">
        <h1>Center Align Button 1: Word Group Selection</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis {dui id erat pellentesque et rhoncus} nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p class="cms-center">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            input.find('.editible').data('editor').getLayout().getElement().find('.raptor-ui-align-center').trigger('click');
        });
    </script>

    <div class="test-2">
        <h1> Center Align Button 2: Single Word Selection</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    Lorem ipsum dolor sit amet, consectetur {adipiscing} elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p class="cms-center">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-2', function(input) {
            input.find('.editible').data('editor').getLayout().getElement().find('.raptor-ui-align-center').trigger('click');
        });
    </script>

    <div class="test-3">
        <h1>Center Align Button 3: Part Word Selection</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pel{lentesqu}e et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p class="cms-center">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-3', function(input) {
            input.find('.editible').data('editor').getLayout().getElement().find('.raptor-ui-align-center').trigger('click');
        });
    </script>

     <div class="test-4">
        <h1>Center Align Button 4: Multi-Paragraph Selection</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui {id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p><p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse} interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p class="cms-center">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p><p class="cms-center">
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-4', function(input) {
            input.find('.editible').data('editor').getLayout().getElement().find('.raptor-ui-align-center').trigger('click');
        });
    </script>

    <div class="test-5">
        <h1>Center Align Button 5: Single Paragraph Selection</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.}
                </p><p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p class="cms-center">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p><p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-5', function(input) {
            input.find('.editible').data('editor').getLayout().getElement().find('.raptor-ui-align-center').trigger('click');
        });
    </script>

     <div class="test-6">
        <h1>Center Align Button 6: More Than One Paragraph Selection</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p><p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.}
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p class="cms-center">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p><p class="cms-center">
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-6', function(input) {
            input.find('.editible').data('editor').getLayout().getElement().find('.raptor-ui-align-center').trigger('click');
        });
    </script>
</body>
</html>