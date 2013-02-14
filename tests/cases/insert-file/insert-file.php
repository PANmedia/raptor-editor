<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
    <?php $uri = '../../../src/'; include __DIR__ . '/../../../src/include.php'; ?>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();

        function testLink(input) {
            var createLinkButton = getLayoutElement(input).find('.raptor-ui-link-create');
            var removeLinkButton = getLayoutElement(input).find('.raptor-ui-link-remove');

            createLinkButton.trigger('click');

            $('.raptor-ui-link-create-menu :input[value=3]').trigger('click');

            document.getElementById('raptor-email').value = "test@test.com";
            document.getElementById('raptor-email-subject').value = "Test subject";

            var insertLinkButton = $('.raptor-ui-link-create-dialog button:contains(Insert Link)');
            insertLinkButton.trigger('click');

            rangesToTokens(rangy.getSelection().getAllRanges());

            if (!createLinkButton.is('.ui-state-highlight')){
                throw new Error('Create link button is not active');
            }
            if (!removeLinkButton.is('.ui-state-highlight')){
                throw new Error('Remove link button is not active');
            }
        }
    </script>
    <div class="test-1">
        <h1>Insert File Button 1: Insert Text File</h1>
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
                    convallis <a href="mailto:test@test.com?Subject=Test%20subject">{dui id erat pellentesque et rhoncus}</a> nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
       testEditor('.test-1', function(input) {


        });
    </script>
    <div class="test-2">
        <h1>Insert File Button 2: Insert Text File</h1>
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
                    convallis <a href="mailto:test@test.com?Subject=Test%20subject">{dui id erat pellentesque et rhoncus}</a> nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
       testEditor('.test-2', function(input) {


        });
    </script>


</body>
</html>