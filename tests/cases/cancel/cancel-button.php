<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
    <?php include __DIR__ . '/../../include.php'; ?>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();
        function clickCancelDialogButton() {
            $('.raptor-ui-cancel-dialog .ui-dialog-buttonpane .ui-button:eq(0)').trigger('click');
        }
    </script>
    <div class="test-1">
        <h1>Cancel Formatting Button 1: Basic</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id <strong class="cms-bold">erat pellentesque</strong> et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula {venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis}, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id <strong class="cms-bold">erat pellentesque</strong> et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula {venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis}, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            clickButton(input, '.raptor-ui-text-italic');
            clickButton(input, '.raptor-ui-cancel');
            clickCancelDialogButton();
        });
    </script>

    <div class="test-2">
        <h1>Cancel Formatting Button 2: Complex</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula {venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis}, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula {venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis}, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-2', function(input) {
            clickButton(input, '.raptor-ui-text-italic');
            clickButton(input, '.raptor-ui-align-center');
            clickButton(input, '.raptor-ui-cancel');
            clickCancelDialogButton();
        });
    </script>

    <div class="test-3">
        <h1>Cancel Formatting Button 3: Multi Paragraph Basic</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui {<strong class="cms-bold">id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.</strong>
                </p>
                <p>
                    <strong class="cms-bold">Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse</strong>} interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui {<strong class="cms-bold">id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.</strong>
                </p>
                <p>
                    <strong class="cms-bold">Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse</strong>} interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-3', function(input) {
            clickButton(input, '.raptor-ui-text-strike');
            clickButton(input, '.raptor-ui-cancel');
            clickCancelDialogButton();
        });
    </script>

    <div class="test-4">
        <h1>Cancel Formatting Button 4: Multi Paragraph Complex</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Lorem ipsum {dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p>
                <p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse <u class="underline">interdum, nisi</u>} nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    Lorem ipsum {dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p>
                <p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse <u class="underline">interdum, nisi</u>} nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-4', function(input) {
            clickButton(input, '.raptor-ui-align-right');
            clickButton(input, '.raptor-ui-list-unordered');
            clickButton(input, '.raptor-ui-cancel');
            clickCancelDialogButton();
        });
    </script>

    <div class="test-5">
        <h1>Cancel Formatting Button 5: Empty Selection in Word</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p><p>
                    Aliquam gravida mauris at
                    ligula <del class="cms-strike">venenatis rhoncus. Suspen{}disse interdum,</del> nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p><p>
                    Aliquam gravida mauris at
                    ligula <del class="cms-strike">venenatis rhoncus. Suspen{}disse interdum,</del> nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-5', function(input) {
            clickButton(input, '.raptor-ui-text-strike');
            clickButton(input, '.raptor-ui-align-right');
            clickButton(input, '.raptor-ui-cancel');
            clickCancelDialogButton();
        });
    </script>

    <div class="test-6">
        <h1>Cancel Formatting Button 6: Empty Selection at the Beginning of a Word</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat <u class="cms-underline">pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada {}hendrerit velit nec tristique.</u>
                </p><p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat <u class="cms-underline">pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada {}hendrerit velit nec tristique.</u>
                </p><p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-6', function(input) {
            clickButton(input, '.raptor-ui-text-bold');
            clickButton(input, '.raptor-ui-text-underline');
            clickButton(input, '.raptor-ui-cancel');
            clickCancelDialogButton();
        });
    </script>

    <div class="test-7">
        <h1>Cancel Formatting Button 7: Alignment</h1>
        <div class="test-input">
            <div class="editable">
                <p class="cms-center">
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id eratpellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit} nec tristique.
                </p><p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p class="cms-center">
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id eratpellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit} nec tristique.
                </p><p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-7', function(input) {
            clickButton(input, '.raptor-ui-text-strike');
            clickButton(input, '.raptor-ui-align-left');
            clickButton(input, '.raptor-ui-cancel');
            clickCancelDialogButton();
        });
    </script>

    <div class="test-8">
        <h1>Cancel Formatting Button 8: Two Different Alignments</h1>
        <div class="test-input">
            <div class="editable">
                <p class="cms-center">
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p><p class="cms-center">
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.}
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p class="cms-center">
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p><p class="cms-center">
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.}
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-8', function(input) {
            clickButton(input, '.raptor-ui-align-right');
            clickButton(input, '.raptor-ui-align-left');
            clickButton(input, '.raptor-ui-cancel');
            clickCancelDialogButton();
        });
    </script>

    <div class="test-9">
        <h1>Cancel Formatting Button 9: Image Float</h1>
        <div class="test-input">
            <div class="editable">
                {<img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />}
                    <div style="clear: both">
                    </div>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                {<img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />}
                    <div style="clear: both">
                    </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-9', function(input) {
            clickButton(input, '.raptor-ui-float-right');
            clickButton(input, '.raptor-ui-cancel');
            clickCancelDialogButton();
        });
    </script>

    <div class="test-10">
        <h1>Cancel Formatting Button 10: Image Float and text and alignment</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    {Some text here.
                </p>
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />}
                    <div style="clear: both">
                    </div>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    {Some text here.
                </p>
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />}
                    <div style="clear: both">
                    </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-10', function(input) {
            clickButton(input, '.raptor-ui-float-right');
            clickButton(input, '.raptor-ui-align-right');
            clickButton(input, '.raptor-ui-text-bold');
            clickButton(input, '.raptor-ui-cancel');
            clickCancelDialogButton();
        });
    </script>

    <div class="test-11">
        <h1>Cancel Formatting Button 11: Guides Disappear</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    {Some text here.
                </p>
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />}
                    <div style="clear: both">
                    </div>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    {Some text here.
                </p>
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />}
                    <div style="clear: both">
                    </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-11', function(input) {
            clickButton(input, '.raptor-ui-guides');
            clickButton(input, '.raptor-ui-cancel');
            clickCancelDialogButton();
        });
    </script>
<?php return; ?>

    <div class="test-12">
        <h1>Cancel Formatting Button 12: Spacer Div Disappears</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    {Some text here.
                </p>
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />}
                    <div style="clear: both">
                    </div>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    {Some text here.
                </p>
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />}
                    <div style="clear: both">
                    </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-12', function(input) {
            clickButton(input, '.raptor-ui-dock-to-screen');
            clickButton(input, '.raptor-ui-cancel');
            clickCancelDialogButton();

            if (input.find('.spacer')) {
                throw new Error('Spacer still displayed');
            }
        });
    </script>

</body>
</html>
