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
        <h1>Dock to Element Button: Dock to Output Div</h1>
        <div class="test-input">
            <div class="editible">
                <p>
                   Lorem ipsum dolor sit {}amet, consectetur adipiscing elit. Maecenas
                   convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                   malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                   ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                   pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.
               </p>
               <p>
                   Hendrerit, felis ac fringilla lobortis, massa ligula aliquet justo, sit
                   amet tincidunt enim quam sollicitudin nisi. Maecenas ipsum augue,
                   commodo sit amet aliquet ut, laoreet ut nunc. Vestibulum ante ipsum
                   primis in faucibus orci luctus et ultrices posuere cubilia Curae;
                   Pellentesque tincidunt eros quis tellus laoreet ac dignissim turpis
                   luctus. Integer nunc est, pulvinar ac tempor ac, pretium ut odio.
               </p>
               <p>
                   Pellentesque in arcu sit amet odio scelerisque tincidunt. Lorem ipsum
                   dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi
                   tristique senectus et netus et malesuada fames ac turpis egestas.
               </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <marker class="raptor-ui-dock-to-element-marker"></marker>
                <p>
                   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
                   convallis dui id erat pellentesque et rhoncus nunc semper. Suspendisse
                   malesuada hendrerit velit nec tristique. Aliquam gravida mauris at
                   ligula venenatis rhoncus. Suspendisse interdum, nisi nec consectetur
                   pulvinar, lorem augue ornare felis, vel lacinia erat nibh in velit.

               </p>
               <p>
                   Hendrerit, felis ac fringilla lobortis, massa ligula aliquet justo, sit
                   amet tincidunt enim quam sollicitudin nisi. Maecenas ipsum augue,
                   commodo sit amet aliquet ut, laoreet ut nunc. Vestibulum ante ipsum
                   primis in faucibus orci luctus et ultrices posuere cubilia Curae;
                   Pellentesque tincidunt eros quis tellus laoreet ac dignissim turpis
                   luctus. Integer nunc est, pulvinar ac tempor ac, pretium ut odio.
               </p>
               <p>
                   Pellentesque in arcu sit amet odio scelerisque tincidunt. Lorem ipsum
                   dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi
                   tristique senectus et netus et malesuada fames ac turpis egestas.
               </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            var dockToElement = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-dock-to-element');
            dockToElement.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());

            if (!dockToElement.is('.ui-state-highlight')){
                throw new Error('Button not active')
            }
        });
    </script>
</body>
</html>