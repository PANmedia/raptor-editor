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
        <h1>Ordered List 1: Create an ordered list from group of words</h1>
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
                    convallis
                </p>
                <ol>
                    <li>{dui id erat pellentesque et rhoncus}</li>
                </ol>
                <p>
                    nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-list-ordered').trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-2">
        <h1>Ordered List 2: Create an ordered list from single word</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    Lorem ipsum dolor sit amet, {consectetur} adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>
                   Lorem ipsum dolor sit amet,
                </p>
                <ol>
                    <li>{consectetur}</li>
                </ol>
                <p>
                    adipiscing elit. Maecenas
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
            input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-list-ordered').trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>


    <div class="test-3">
        <h1>Ordered List 3: Create an ordered list from empty selection before a word</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    Lorem ipsum dolor sit amet, {}consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <ol>
                    <li>Lorem ipsum dolor sit amet, {}consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.</li>
                </ol>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-3', function(input) {
            input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-list-ordered').trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-4">
        <h1>Ordered List 4: Create an ordered list from empty selection inside a word</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendr{}erit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <ol>
                    <li> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendr{}erit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.</li>
                </ol>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-4', function(input) {
            input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-list-ordered').trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-5">
       <h1>Ordered List 5: Create an ordered list with multiple items selection from part word to part word</h1>
        <div class="test-input">
            <div class="editible">
                  <p>Lor{em ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  <p>Maecenas convallis dui id erat pellentesque et rhoncus nunc semper.</p>
                  <p>Suspendisse malesuada hendrerit velit nec tristique.</p>
                  <p>Aliquam gravida mauris at ligula venenatis rhonc}us.</p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>Lor</p>
                <ol>
                    <li>{em ipsum dolor sit amet, consectetur adipiscing elit.</li>
                    <li>Maecenas convallis dui id erat pellentesque et rhoncus nunc semper.</li>
                    <li>Suspendisse malesuada hendrerit velit nec tristique.</li>
                    <li>Aliquam gravida mauris at ligula venenatis rhonc}</li>
                </ol>
                <p>us.</p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-5', function(input) {
            input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-list-ordered').trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-6">
        <h1>Ordered List 6: Create an ordered list with multiple items</h1>
        <div class="test-input">
            <div class="editible">
                {
                    <p>Item 1</p>
                    <p>Item 2</p>
                    <p>Item 3</p>
                    <p>Item 4</p>
                }
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <ol>{
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                    <li>Item 4</li>
                    }
                </ol>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-6', function(input) {
            input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-list-ordered').trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-7">
        <h1>Ordered List 7: Create an ordered list with multiple heading items</h1>
        <div class="test-input">
            <div class="editible">
                {
                    <h3>Item 1</h3>
                    <h2>Item 2</h2>
                    <h1>Item 3</h1>
                    <h4>Item 4</h4>
                }
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <ol>{
                    <li><h3>Item 1</h3></li>
                    <li><h2>Item 2</h2></li>
                    <li><h1>Item 3</h1></li>
                    <li><h4>Item 4</h4></li>
                    }
                </ol>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-7', function(input) {
            input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-list-ordered').trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-8">
        <h1>Ordered List 8: Toggle bottom list of two lists and check selection remains on bottom list</h1>
        <div class="test-input">
            <div class="editible">
                <ol>
                    <li><h3>Item 1</h3></li>
                </ol>
                 <h2>{Item 2}</h2>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <ol>
                    <li><h3>Item 1</h3></li>
                </ol>
                <ol>
                    <li><h2>{Item 2}</h2></li>
                </ol>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-8', function(input) {
            var unorderedListButton = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-list-ordered');
            unorderedListButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

//            if (!unorderedListButton.is('.ui-state-highlight')){
//                throw new Error('Button is not active');
//            }
        });
    </script>
</body>
</html>