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
        <h1>Insert File Button 1: Insert Image File No Selection</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. {}Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper.
                    <img src="../../images/raptor.png" title="Raptor Image" class="cms-png"/> {}Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
       testEditor('.test-1', function(input) {
            var location = '../../images/raptor.png';
            var name = 'Raptor Image';

            var insertFileButton = getLayoutElement(input).find('.raptor-ui-insert-file');
            insertFileButton.trigger('click');

            var dialog = $('.ui-dialog');

            dialog.find('input[name="location"]').val(location);
            dialog.find('input[name="name"]').val(name);

            var acceptButton = dialog.find('button:contains(Insert file)');
            acceptButton.trigger('click');

            rangesToTokens(rangy.getSelection().getAllRanges());

            if (insertFileButton.is('.ui-state-highlight')){
                throw new Error('Insert File button is active');
            }
       });
    </script>

<!--    <div class="test-2">
        <h1>Insert File Button 2: Insert Image File With Selection</h1>
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
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis <img src="../../images/raptor.png" title="dui id erat pellentesque et rhoncus" class="cms-png"/>{} nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
       testEditor('.test-2', function(input) {
            var location = '../../images/raptor.png';
            var name = 'Raptor Image';

            var insertFileButton = getLayoutElement(input).find('.raptor-ui-insert-file');
            insertFileButton.trigger('click');

            var dialog = $('.ui-dialog');

            dialog.find('input[name="location"]').val(location);
            dialog.find('input[name="name"]').val(name);

            var acceptButton = dialog.find('button:contains(Insert file)');
            acceptButton.trigger('click');

            rangesToTokens(rangy.getSelection().getAllRanges());

            if (insertFileButton.is('.ui-state-highlight')){
                throw new Error('Insert File button is active');
            }
       });
    </script>-->

</body>
</html>