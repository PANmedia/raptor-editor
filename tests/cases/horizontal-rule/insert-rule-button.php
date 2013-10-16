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
        <h1>Insert Horizontal Rule Button 1: Word Group Selection</h1>
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
                    convallis
                </p>
                <hr>
                <p>
                    {}nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            var hrCreateButton = getLayoutElement(input).find('.raptor-ui-hr-create');
            hrCreateButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

        });
    </script>

    <div class="test-2">
        <h1>Insert Horizontal Rule Button 2: Single Word Selection</h1>
        <div class="test-input">
            <div class="editable">
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
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur
                </p>
                <hr>
                <p>
                    {}elit. Maecenas
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
            var hrCreateButton = getLayoutElement(input).find('.raptor-ui-hr-create');
            hrCreateButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

        });
    </script>

    <div class="test-3">
        <h1>Insert Horizontal Rule Button 3: Part Word Selection</h1>
        <div class="test-input">
            <div class="editable">
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
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pel
                </p>
                <hr>
                <p>
                    {}e et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-3', function(input) {
            var hrCreateButton = getLayoutElement(input).find('.raptor-ui-hr-create');
            hrCreateButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

        });
    </script>

     <div class="test-4">
        <h1>Insert Horizontal Rule Button 4: Multi-Paragraph Selection</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui {id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p>
                <p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse} interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui
                </p>
                <hr>
                <p>
                    {}interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-4', function(input) {
            var hrCreateButton = getLayoutElement(input).find('.raptor-ui-hr-create');
            hrCreateButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

        });
    </script>

    <div class="test-5">
        <h1>Insert Horizontal Rule Button 5: Paragraph Selection</h1>
        <div class="test-input">
            <div class="editable">
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
            <div class="editable">
               <hr>{}
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-5', function(input) {
            var hrCreateButton = getLayoutElement(input).find('.raptor-ui-hr-create');
            hrCreateButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

        });
    </script>

    <div class="test-6">
        <h1>Insert Horizontal Rule Button 6: Empty Selection in Word</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p><p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspen{}disse interdum, nisi nec consectetur
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
                    ligula venenatis rhoncus.
                </p>
                <hr>
                <p>
                    {}Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-6', function(input) {
            var hrCreateButton = getLayoutElement(input).find('.raptor-ui-hr-create');
            hrCreateButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

        });
    </script>

    <div class="test-7">
        <h1>Insert Horizontal Rule Button 7: Empty Selection at the Beginning of a Word</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada {}hendrerit velit nec tristique.
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
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada
                </p>
                <hr>
                <p>
                    {}hendrerit velit nec tristique.
                </p>
                <p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-7', function(input) {
            var hrCreateButton = getLayoutElement(input).find('.raptor-ui-hr-create');
            hrCreateButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

        });
    </script>
</body>
</html>
