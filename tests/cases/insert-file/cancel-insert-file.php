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
        <h1>Cancel Insert File Button 1: Cancel Insert File Without Details</h1>
        <div class="test-input">
            <div class="editable">
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
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis {dui id erat pellentesque et rhoncus} nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
       testEditor('.test-1', function(input){
            var insertFileButton = getLayoutElement(input).find('.raptor-ui-insert-file');
            insertFileButton.trigger('click');

            var cancelButton = $('button:contains(Cancel)');
            cancelButton.trigger('click');

            rangesToTokens(rangy.getSelection().getAllRanges());

            if (insertFileButton.is('.ui-state-highlight')){
                throw new Error('Insert File button is active');
            }
       });
    </script>

    <div class="test-2">
        <h1>Cancel Insert File Button 2: Cancel Insert File With Details</h1>
        <div class="test-input">
            <div class="editable">
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
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis {dui id erat pellentesque et rhoncus} nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
       testEditor('.test-2', function(input){
            var location = '../../images/raptor.png';
            var name = 'Raptor Image';

            var insertFileButton = getLayoutElement(input).find('.raptor-ui-insert-file');
            insertFileButton.trigger('click');

            var dialog = $('.ui-dialog');

            dialog.find('input[name="location"]').val(location);
            dialog.find('input[name="name"]').val(name);

            var cancelButton = $('button:contains(Cancel)');
            cancelButton.trigger('click');

            rangesToTokens(rangy.getSelection().getAllRanges());

            if (insertFileButton.is('.ui-state-highlight')){
                throw new Error('Insert File button is active');
            }
       });
    </script>

</body>
</html>
