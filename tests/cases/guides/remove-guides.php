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
        <h1>Remove Guides 1: Single Paragraph</h1>
        <div class="test-input">
            <div class="editable raptor-ui-guides-visible">
                <p>
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit} velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable" >
                <p>
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit} velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            var guidesButton = getLayoutElement(input).find('.raptor-ui-guides');
            guidesButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            if (guidesButton.is('.ui-state-highlight')){
                throw new Error('Button is active');
            }
        });
    </script>
     <div class="test-2">
        <h1>Remove Guides 2: Single Paragraph with multiple attributes</h1>
        <div class="test-input">
            <div class="editable raptor-ui-guides-visible">
                <h1>This </h1><h2>is</h2><h1> a </h1><h3>header</h3>
                <p>
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat
                </p>
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />
                <p> pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada </p><blockquote>hendrerit} velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum,</blockquote>
                    <hr><p>
                    nisi nec consectetur
                    </p>
                    <ol>
                        <li>pulvinar, lorem</li>
                        <li>augue ornare felis,</li>
                    </ol>
                    <ul>
                        <li>vel lacinia</li>
                        <li>erat nibh in velit.</li>
                    </ul>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable" >
                    <h1>This </h1><h2>is</h2><h1> a </h1><h3>header</h3>
                <p>
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat
                </p>
                <img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />
                <p> pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada </p><blockquote>hendrerit} velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum,</blockquote>
                    <hr><p>
                    nisi nec consectetur
                    </p>
                    <ol>
                        <li>pulvinar, lorem</li>
                        <li>augue ornare felis,</li>
                    </ol>
                    <ul>
                        <li>vel lacinia</li>
                        <li>erat nibh in velit.</li>
                    </ul>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-2', function(input) {
            var guidesButton = getLayoutElement(input).find('.raptor-ui-guides');
            guidesButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            if (guidesButton.is('.ui-state-highlight')){
                throw new Error('Button is active');
            }
        });
    </script>
    <div class="test-3">
        <h1>Remove Guides 3: Multi Paragraph</h1>
        <div class="test-input">
            <div class="editable raptor-ui-guides-visible">
                <p>
                    {Lorem ipsum dolor s<img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />it amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit} velit nec tristique.
                </p><p>
                    Aliquam gravida mauris at<hr>
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable" >
                <p>
                    {Lorem ipsum dolor s<img src="../../images/raptor.png" alt="raptor logo" height="50" width="40" />it amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit} velit nec tristique.
                </p><p>
                    Aliquam gravida mauris at<hr>
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-3', function(input) {
            var guidesButton = getLayoutElement(input).find('.raptor-ui-guides');
            guidesButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            if (guidesButton.is('.ui-state-highlight')){
                throw new Error('Button is active');
            }
        });
    </script>
    <div class="test-4">
        <h1>Remove Guides 4: After save</h1>
        <div class="test-input">
            <div class="editable raptor-ui-guides-visible">
                <p>
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit} velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable" >
                <p>
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit} velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-4', function(input) {
            var guidesButton = getLayoutElement(input).find('.raptor-ui-guides');
            guidesButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            getRaptor(input).fire('saved');
            if (guidesButton.is('.ui-state-highlight')){
                throw new Error('Button is active');
            }
        });
    </script>
    <div class="test-5">
        <h1>Remove Guides 5: After cancel</h1>
        <div class="test-input">
            <div class="editable raptor-ui-guides-visible">
                <p>
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit} velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable" >
                <p>
                    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                    convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                    malesuada hendrerit} velit nec tristique. Aliquam gravida mauris at
                    ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                    pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-5', function(input) {
            var guidesButton = getLayoutElement(input).find('.raptor-ui-guides');
            guidesButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            getRaptor(input).fire('cancel');
            if (guidesButton.is('.ui-state-highlight')){
                throw new Error('Button is active');
            }
        });
    </script>
</body>
</html>
