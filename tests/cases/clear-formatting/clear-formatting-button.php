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
        <h1>Clear Formatting Button 1: Basic</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    Test 1 {paragraph 1 start.
                    <strong class="cms-bold">Some bold text.</strong>
                    Test 1 paragraph} 1 end.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>
                    Test 1 {paragraph 1 start.
                    Some bold text.
                    Test 1 paragraph} 1 end.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-2">
        <h1>Clear Formatting Button 2: Complex</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    Paragraph 1
                    <em class="cms-italic">{Some italic text</em>
                </p>
                <ol>
                    <li>
                        <del class="cms-strike">Some strike text in a list</del>
                    </li>
                </ol>
                <p>
                    <em class="cms-italic">Some more italic text</em>
                    Paragraph} 2
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>
                    Paragraph 1
                    {Some italic text
                </p><p>
                    Some strike text in a list
                </p><p>
                    Some more italic text
                    Paragraph} 2
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-2', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-3">
        <h1>Clear Formatting Button 3: Multi Basic</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis {dui id <strong class="cms-bold">erat pellentesque</strong> et rhoncus} nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. <em class="cms-italic">Suspendisse interdum, nisi nec consectetur</em>
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis {dui id erat pellentesque et rhoncus} nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. <em class="cms-italic">Suspendisse interdum, nisi nec consectetur</em>
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-3', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

     <div class="test-4">
        <h1>Clear Formatting Button 4: Multi Paragraph Basic</h1>
        <div class="test-input">
            <div class="editible">
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
            <div class="editible">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui {id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p>
                <p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse}interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-4', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-5">
        <h1>Clear Formatting Button 5: Multi Paragraph Complex</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    Lorem ipsum {<strong class="cms-bold">dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada <span class="cms-underline">hendrerit velit nec tristique.</span></strong>
                </p><p>
                    <span class="cms-underline cms-bold">Aliquam gravida mauris at
                    ligula</span>
                </p>
                <ul><li><span class="cms-underline cms-bold">venenatis rhoncus.</span></li></ul>
                <p><span class="cms-underline"><strong class="cms-bold"> Suspendisse}</strong> interdum, nisi</span> nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>
                    Lorem ipsum {dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p><p>
                    Aliquam gravida mauris at
                    ligula
                </p>
                <p>venenatis rhoncus.</p>
                <p> Suspendisse}<span class="cms-underline"> interdum, nisi</span> nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-5', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-6">
        <h1>Clear Formatting Button 6: Empty Selection in Word</h1>
        <div class="test-input">
            <div class="editible">
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
            <div class="editible">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p><p>
                    Aliquam gravida mauris at
                    ligula <del class="cms-strike">venenatis rhoncus. </del>Suspen{}disse<del class="cms-strike"> interdum,</del> nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-6', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-7">
        <h1>Clear Formatting Button 7: Empty Selection at the Beginning of a Word</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat <span class="cms-underline">pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada {}hendrerit velit nec tristique.</span>
                </p><p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat <span class="cms-underline">pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada {}hendrerit velit nec tristique.</span>
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
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-8">
        <h1>Clear Formatting Button 8: Alignment</h1>
        <div class="test-input">
            <div class="editible">
                <p class="cms-center">
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat <span class="cms-underline">pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit} nec tristique.</span>
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
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse malesuada hendrerit velit
                    <span class="cms-underline">
                        } nec tristique.
                    </span>
                </p>
                <p>
                    Aliquam gravida mauris at ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-8', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-9">
        <h1>Clear Formatting Button 9: Two Different Alignments</h1>
        <div class="test-input">
            <div class="editible">
                <p class="cms-right">
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p><p class="cms-left">
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.}
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id eratpellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p><p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.}
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-9', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-10">
        <h1>Clear Formatting Button 10: Alignment and Other Formatting</h1>
        <div class="test-input">
            <div class="editible">
                <p class="cms-right">
                    {Lorem ipsum <span class="cms-underline"> dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique</span>.
                </p><p class="cms-left">
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.}
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id eratpellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique.
                </p><p>
                    Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.}
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-10', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-11">
        <h1>Clear Formatting Button 11: Image Float</h1>
        <div class="test-input">
            <div class="editible">
                {<img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" class="cms-float-right" />}
                <div style="clear: both"></div>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                {<img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />}
                <div style="clear: both"></div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-11', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-12">
        <h1>Clear Formatting Button 12: Image Float and text and alignment</h1>
        <div class="test-input">
            <div class="editible">
                <p class="cms-right">
                    {Some text that can be <strong class="cms-bold">bold</strong> and <span class="cms-underline">underlined</span> and <em class="cms-italic">italic</em> as
                    well as being right aligned before clearing the formatting.
                </p>
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" class="cms-float-right"  />}
                    <div style="clear: both">
                    </div>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>
                    {Some text that can be bold and underlined and italic as
                    well as being right aligned before clearing the formatting.
                </p>
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />}
                    <div style="clear: both">
                    </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-12', function(input) {
            clickButton(input, '.raptor-ui-clear-formatting');
            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>
</body>
</html>