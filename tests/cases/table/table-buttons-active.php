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
        <h1>Create Table Button 1: Active When Table is Not Selected</h1>
         <div class="test-input">
            <div class="editible">
                <p>{some text that is selected}</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell 1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>{some text that is selected}</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell 1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            var createTableButton = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-table-create');
            createTableButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            
            if (!createTableButton.is('.ui-state-active')) {
                throw new Error('Button is not active');
            } 
        });
    </script>
    
    <div class="test-2">
        <h1>Insert Column Button 1: Active When Table is Selected in Cell</h1>
         <div class="test-input">
            <div class="editible">
               <p>some text that isn't selected</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell {}1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>some text that isn't selected</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell {}1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-2', function(input) {
            var insertColumnButton = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-table-insert-column');
            insertColumnButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            
            if (!insertColumnButton.is('.ui-state-active')) {
                throw new Error('Button is not active');
            } 
        });
    </script>
    
    <div class="test-3">
        <h1>Insert Row Button 1: Active When Table is Selected in Cell</h1>
         <div class="test-input">
            <div class="editible">
               <p>some text that isn't selected</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell {}1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>some text that isn't selected</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell {}1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-3', function(input) {
            var insertRowButton = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-table-insert-row');
            insertRowButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            
            if (!insertRowButton.is('.ui-state-active')) {
                throw new Error('Button is not active');
            } 
        });
    </script>
    
    <div class="test-4">
        <h1>Delete Column Button 1: Active When Table is Selected in Cell</h1>
         <div class="test-input">
            <div class="editible">
               <p>some text that isn't selected</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell {}1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>some text that isn't selected</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell {}1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-4', function(input) {
            var deleteColumnButton = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-table-delete-column');
            deleteColumnButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            
            if (!deleteColumnButton.is('.ui-state-active')) {
                throw new Error('Button is not active');
            } 
        });
    </script>
    
     <div class="test-5">
        <h1>Delete Row Button 1: Active When Table is Selected in Cell</h1>
         <div class="test-input">
            <div class="editible">
               <p>some text that isn't selected</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell {}1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>some text that isn't selected</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell {}1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-', function(input) {
            var deleteRowButton = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-table-delete-row');
            deleteRowButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            
            if (!deleteRowButton.is('.ui-state-active')) {
                throw new Error('Button is not active');
            } 
        });
    </script>
    
     <div class="test-6">
        <h1>Create Table Button 2: Active When Table is Selected</h1>
         <div class="test-input">
            <div class="editible">
                <p>some text that isn't selected</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell 1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell {}0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>{some text that is selected}</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell 1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-6', function(input) {
            var createTableButton = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-table-create');
            createTableButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            
            if (!createTableButton.is('.ui-state-active')) {
                throw new Error('Button is not active');
            } 
        });
    </script>
    
    <div class="test-7">
        <h1>Insert Column Button 2: Not Active When Table is Not Selected in Cell</h1>
         <div class="test-input">
            <div class="editible">
               <p>{some text that is selected}</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell 1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>{some text that is selected}</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell 1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-7', function(input) {
            var insertColumnButton = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-table-insert-column');
            insertColumnButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            
            if (insertColumnButton.is('.ui-state-active')) {
                throw new Error('Button is active');
            } 
        });
    </script>
    
    <div class="test-8">
        <h1>Insert Row Button 8: Not Active When Table is Not Selected in Cell</h1>
         <div class="test-input">
            <div class="editible">
               <p>{some text that is selected}</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell 1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>{some text that is selected}</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell 1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-8', function(input) {
            var insertRowButton = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-table-insert-row');
            insertRowButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            
            if (insertRowButton.is('.ui-state-active')) {
                throw new Error('Button is active');
            } 
        });
    </script>
    
    <div class="test-9">
        <h1>Delete Column Button 2: Not Active When Table is not Selected in Cell</h1>
         <div class="test-input">
            <div class="editible">
               <p>{some text that is selected}</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell 1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>{some text that is selected}</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell 1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-9', function(input) {
            var deleteColumnButton = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-table-delete-column');
            deleteColumnButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            
            if (deleteColumnButton.is('.ui-state-active')) {
                throw new Error('Button is active');
            } 
        });
    </script>
    
     <div class="test-10">
        <h1>Delete Row Button 2: Not Active When Table is Not Selected in Cell</h1>
         <div class="test-input">
            <div class="editible">
               <p>{some text that is selected}</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell {}1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="test-expected">
            <div class="editible">
                <p>{some text that is selected}</p>
                <table>
                    <tr>
                        <td>Cell 0,0</td>
                        <td>Cell {}1,0</td>
                        <td>Cell 2,0</td>
                    </tr>
                    <tr>
                        <td>Cell 0,1</td>
                        <td>Cell 1,1</td>
                        <td>Cell 2,1</td>
                    </tr>
                    <tr>
                        <td>Cell 0,2</td>
                        <td>Cell 1,2</td>
                        <td>Cell 2,2</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-10', function(input) {
            var deleteRowButton = input.find('.editible').data('raptor').getLayout().getElement().find('.raptor-ui-table-delete-row');
            deleteRowButton.trigger('click');
            rangesToTokens(rangy.getSelection().getAllRanges());
            
            if (deleteRowButton.is('.ui-state-active')) {
                throw new Error('Button is active');
            } 
        });
    </script>
</body>
</html>