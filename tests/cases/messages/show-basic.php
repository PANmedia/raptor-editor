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
        <h1>Messages 1: Show basic confirm</h1>
        <div class="test-input">
            <div class="editable"></div>
        </div>
        <div class="test-expected">
            <div class="editable"></div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            var message = 'A basic confirm message';
            var raptor = getRaptor(input);
            raptor.showConfirm(message, {
                delay: 5,
                hide: function() { }
            });
            if (!raptor.getLayout().getElement().find('.raptor-message-circle-check').length) {
                throw new Error('Confirm message was not displayed');
            }
        });
    </script>
    <div class="test-2">
        <h1>Messages 2: Show basic info</h1>
        <div class="test-input">
            <div class="editable"></div>
        </div>
        <div class="test-expected">
            <div class="editable"></div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-2', function(input) {
            var message = 'A basic info message';
            var raptor = getRaptor(input);
            raptor.showInfo(message, {
                delay: 5,
                hide: function() { }
            });
            if (!raptor.getLayout().getElement().find('.raptor-message-info').length) {
                throw new Error('Info message was not displayed');
            }
        });
    </script>
    <div class="test-3">
        <h1>Messages 3: Show basic error</h1>
        <div class="test-input">
            <div class="editable"></div>
        </div>
        <div class="test-expected">
            <div class="editable"></div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-3', function(input) {
            var message = 'A basic error message';
            var raptor = getRaptor(input);
            raptor.showError(message, {
                delay: 5,
                hide: function() { }
            });
            if (!raptor.getLayout().getElement().find('.raptor-message-circle-close').length) {
                throw new Error('Error message was not displayed');
            }
        });
    </script>
    <div class="test-4">
        <h1>Messages 4: Show basic alert</h1>
        <div class="test-input">
            <div class="editable"></div>
        </div>
        <div class="test-expected">
            <div class="editable"></div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-4', function(input) {
            var message = 'A basic error message';
            var raptor = getRaptor(input);
            raptor.showWarning(message, {
                delay: 5,
                hide: function() { }
            });
            if (!raptor.getLayout().getElement().find('.raptor-message-alert').length) {
                throw new Error('Alert message was not displayed');
            }
        });
    </script>
    <div class="test-5">
        <h1>Messages 5: Show basic loading</h1>
        <div class="test-input">
            <div class="editable"></div>
        </div>
        <div class="test-expected">
            <div class="editable"></div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-5', function(input) {
            var message = 'A basic error message';
            var raptor = getRaptor(input);
            raptor.showLoading(message, {
                delay: 5,
                hide: function() { }
            });
            if (!raptor.getLayout().getElement().find('.raptor-message-clock').length) {
                throw new Error('Loading message was not displayed');
            }
        });
    </script>
</body>
</html
