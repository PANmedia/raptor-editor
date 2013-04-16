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
        <h1>Embed Object Button 1: Word Group Selection</h1>
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
                    convallis <video src="http://www.youtube.com/watch?v=KQbySwxU8L4" controls></video>{} nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            var embedButton = getLayoutElement(input).find('.raptor-ui-embed');
            embedButton.trigger('click');

            var video = 'http://www.youtube.com/watch?v=KQbySwxU8L4';

            var textarea = $(document.querySelector('.raptor-ui-embed-tab > textarea'));
            textarea.value = video;

            var embedObjectButton = $('.raptor-ui-embed-dialog button:contains(Embed Object)');
            embedObjectButton.trigger('click');

            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-2">
        <h1>Embed Object Button 2: Single Word Selection</h1>
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
                    Lorem ipsum dolor sit amet, consectetur <video src="http://www.youtube.com/watch?v=KQbySwxU8L4" controls></video>{} elit. Maecenas
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
            var embedButton = getLayoutElement(input).find('.raptor-ui-embed');
            embedButton.trigger('click');

            var video = 'http://www.youtube.com/watch?v=KQbySwxU8L4';

            var textarea = $(document.querySelector('.raptor-ui-embed-tab > textarea'));
            textarea.value = video;

            var embedObjectButton = $('.raptor-ui-embed-dialog button:contains(Embed Object)');
            embedObjectButton.trigger('click');

            rangesToTokens(rangy.getSelection().getAllRanges());
        });
        });
    </script>

    <div class="test-3">
        <h1>Embed Object Button 3: Part Word Selection</h1>
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
                    convallis dui id erat pel<video src="http://www.youtube.com/watch?v=KQbySwxU8L4" controls></video>{}e et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-3', function(input) {
            var embedButton = getLayoutElement(input).find('.raptor-ui-embed');
            embedButton.trigger('click');

            var video = 'http://www.youtube.com/watch?v=KQbySwxU8L4';

            var textarea = $(document.querySelector('.raptor-ui-embed-tab > textarea'));
            textarea.value = video;

            var embedObjectButton = $('.raptor-ui-embed-dialog button:contains(Embed Object)');
            embedObjectButton.trigger('click');

            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

     <div class="test-4">
        <h1>Embed Object Button 4: Multi-Paragraph Selection</h1>
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
                    <video src="http://www.youtube.com/watch?v=KQbySwxU8L4" controls></video>{}
                <p>
                    interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-4', function(input) {
            var embedButton = getLayoutElement(input).find('.raptor-ui-embed');
            embedButton.trigger('click');

            var video = 'http://www.youtube.com/watch?v=KQbySwxU8L4';

            var textarea = $(document.querySelector('.raptor-ui-embed-tab > textarea'));
            textarea.value = video;

            var embedObjectButton = $('.raptor-ui-embed-dialog button:contains(Embed Object)');
            embedObjectButton.trigger('click');

            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-5">
        <h1>Embed Object Button 5: Paragraph Selection</h1>
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
                <p>
                    <video src="http://www.youtube.com/watch?v=KQbySwxU8L4" controls></video>{}
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-5', function(input) {
            var embedButton = getLayoutElement(input).find('.raptor-ui-embed');
            embedButton.trigger('click');

            var video = 'http://www.youtube.com/watch?v=KQbySwxU8L4';

            var textarea = $(document.querySelector('.raptor-ui-embed-tab > textarea'));
            textarea.value = video;

            var embedObjectButton = $('.raptor-ui-embed-dialog button:contains(Embed Object)');
            embedObjectButton.trigger('click');

            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-6">
        <h1>Embed Object Button 6: Empty Selection in Word</h1>
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
                    ligula venenatis rhoncus. <video src="http://www.youtube.com/watch?v=KQbySwxU8L4" controls></video>{} interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-6', function(input) {
            var embedButton = getLayoutElement(input).find('.raptor-ui-embed');
            embedButton.trigger('click');

            var video = 'http://www.youtube.com/watch?v=KQbySwxU8L4';

            var textarea = $(document.querySelector('.raptor-ui-embed-tab > textarea'));
            textarea.value = video;

            var embedObjectButton = $('.raptor-ui-embed-dialog button:contains(Embed Object)');
            embedObjectButton.trigger('click');

            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>

    <div class="test-7">
        <h1>Embed Object Button 7: Empty Selection at the Beginning of a Word</h1>
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
                    malesuada <video src="http://www.youtube.com/watch?v=KQbySwxU8L4" controls></video>{}hendrerit velit nec tristique.
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
            var embedButton = getLayoutElement(input).find('.raptor-ui-embed');
            embedButton.trigger('click');

            var video = 'http://www.youtube.com/watch?v=KQbySwxU8L4';

            var textarea = $(document.querySelector('.raptor-ui-embed-tab > textarea'));
            textarea.value = video;

            var embedObjectButton = $('.raptor-ui-embed-dialog button:contains(Embed Object)');
            embedObjectButton.trigger('click');

            rangesToTokens(rangy.getSelection().getAllRanges());
        });
    </script>
</body>
</html>
