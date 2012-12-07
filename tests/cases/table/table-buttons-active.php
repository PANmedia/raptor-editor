<!doctype html>
<html>
<head>
    <script type="text/javascript" src="../../js/case.js"></script>
    <?php $uri = '../../../src/'; include '../../../src/include.php'; ?>
</head>
<body class="simple">
    <script type="text/javascript">
        rangy.init();
    </script>
    <div class="test-1">
        <h1>Ordered List Button 1: Active When List is Selected</h1>
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
        testEditor('.test-1', function(input) {
            var orderedListButton = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-list-ordered');
            orderedListButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            
            if (!orderedListButton.is('.ui-state-active')) {
                throw new Error('Button is not active');
            } 
            
        });
    </script>
    
    <div class="test-2">
        <h1>Unordered List Button 1: Active When List is Selected</h1>
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
        testEditor('.test-2', function(input) {
            var unorderedListButton = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-list-unordered');
            unorderedListButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            
            if (!unorderedListButton.is('.ui-state-active')) {
                throw new Error('Button is not active');
            } 
            
        });
    </script>
    
    <div class="test-3">
        <h1>Ordered List Button 2: Not Active When List is Not Selected</h1>
         <div class="test-input">
            <div class="editible">
                    <p>Item 1</p>
                    <p>Item 2</p>
                    <p>Item 3</p>
                    <p>Item 4</p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <ol>
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                    <li>Item 4</li>
                </ol>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-3', function(input) {
            var orderedListButton = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-list-ordered');
            orderedListButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            
            if (orderedListButton.is('.ui-state-active')) {
                throw new Error('Button is active');
            } 
            
        });
    </script>
    
    <div class="test-4">
        <h1>Unordered List Button 2: Not Active When List is Not Selected</h1>
         <div class="test-input">
            <div class="editible">
                    <p>Item 1</p>
                    <p>Item 2</p>
                    <p>Item 3</p>
                    <p>Item 4</p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <ol>
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                    <li>Item 4</li>
                </ol>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-4', function(input) {
            var unorderedListButton = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-list-unordered');
            unorderedListButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            
            if (unorderedListButton.is('.ui-state-active')) {
                throw new Error('Button is active');
            } 
            
        });
    </script>
</body>
</html>