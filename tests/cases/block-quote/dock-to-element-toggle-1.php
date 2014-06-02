<!doctype html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <script type="text/javascript" src="../../js/case.js"></script>
    <?php include __DIR__ . '/../../include.php'; ?>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();
        var options = {
            plugins: {
                dock: {
                    docked: true,
                    dockToElement: true
                }
            }
        };
    </script>
<!--    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            var ranges = tokensToRanges(input);
            listToggle('blockquote', 'p', input);
            selectionToTokens();
        });
    </script>-->

        <div class="test-1">
        <h1>List 1: simple listToggle within a &lt;p&gt;</h1>
        <div class="test-input">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                convallis {dui id erat pellentesque et rhoncus} nunc semper. Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </p>
        </div>
        <div class="test-expected">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                convallis
            </p>
            <blockquote>
                <p>
                    {dui id erat pellentesque et rhoncus}
                </p>
            </blockquote>
            <p>
                nunc semper. Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            tokensToSelection(input);
            listToggle('blockquote', 'p', input);
            selectionToTokens();
        }, options);
    </script>
    <div class="test-2">
        <h1>List 2: listToggle within an &lt;a&gt;</h1>
        <div class="test-input">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. <a href="#">Maecenas
                convallis {dui id erat pellentesque et rhoncus} nunc semper</a>. Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </p>
        </div>
        <div class="test-expected">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. <a href="#">Maecenas
                convallis</a>
            </p>
            <blockquote>
                <p>
                    {dui id erat pellentesque et rhoncus}
                </p>
            </blockquote>
            <p>
                <a href="#">nunc semper</a>. Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-2', function(input) {
            tokensToSelection(input);
            listToggle('blockquote', 'p', input);
            selectionToTokens();
        });
    </script>
    <div class="test-3">
        <h1>List 3: listToggle crossing from an &lt;h2&gt; to an a inside a &lt;p&gt;</h1>
        <div class="test-input">
            <h2>This is a {#2 heading</h2>
            <p>
                This is the paragraph content. <a href="#">This is a link} inside
                the paragraph</a>. Finally, we have more paragraph content.
            </p>
        </div>
        <div class="test-expected">
            <h2>This is a </h2>
            <blockquote>
                <h2>#2 heading</h2>
                <p>
                    { This is the paragraph content. <a href="#">This is a link</a>}
                </p>
            </blockquote>
            <p>
                <a href="#"> inside the paragraph</a>. Finally, we have more
                paragraph content.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-3', function(input) {
            tokensToSelection(input);
            listToggle('blockquote', 'p', input);
            selectionToTokens();
        });
    </script>
    <div class="test-4">
        <h1>List 4: listToggle unwrapping simple list</h1>
        <div class="test-input">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                convallis
            </p>
            <blockquote>
                <p>{dui id erat pellentesque et rhoncus}</p>
            </blockquote>
            <p>
                nunc semper. Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </p>
        </div>
        <div class="test-expected">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                convallis
            </p>
            {}
            <p>
                dui id erat pellentesque et rhoncus
            </p>
            <p>
                nunc semper. Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-4', function(input) {
            tokensToSelection(input);
            listToggle('blockquote', 'p', input);
            selectionToTokens();
        });
    </script>
    <div class="test-5">
        <h1>List 5: listToggle unwrapping list crossing an &lt;a&gt;</h1>
        <div class="test-input">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. <a href="#">Maecenas
                convallis</a>
            </p>
            <blockquote>
                <p>{dui id erat pellentesque et rhoncus}</p>
            </blockquote>
            <p>
                <a href="#">nunc semper</a>. Suspendisse
                malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
            </p>
        </div>
        <div class="test-expected">
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. <a href="#">Maecenas
                convallis</a>
            </p>
            {}
            <p>
                dui id erat pellentesque et rhoncus
            </p>
            <p>
                <a href="#">nunc semper</a>. Suspendisse malesuada hendrerit velit
                nec tristique. Aliquam gravida mauris at ligula venenatis rhoncus.
                Suspendisse interdum, nisi nec consectetur pulvinar, lorem augue
                ornare felis, vel lacinia erat nibh in velit.
            </p>
        </div>
    </div>
    <script type="text/javascript">
        test('.test-5', function(input) {
            tokensToSelection(input);
            listToggle('blockquote', 'p', input);
            selectionToTokens();
        });
    </script>
</body>
</html>
