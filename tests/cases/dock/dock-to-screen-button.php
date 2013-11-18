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
        <h1>Dock to Screen Button 1: Dock Toolbar to screen</h1>
        <div class="test-input">
            <div class="editable">
                <p>
                   Some Content.
                </p>
            </div>
        </div>
        <div class="test-expected">
            <div class="editable">
                <p>
                   Some Content.
                </p>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        testEditor('.test-1', function(input) {
            var dockToScreen = getLayoutElement(input).find('.raptor-ui-dock-to-screen');
            if (!dockToScreen.is('.ui-state-highlight')) {
                throw new Error('Button not active (Raptor should have started docked)')
            }
            dockToScreen.trigger('click');
            if (dockToScreen.is('.ui-state-highlight')) {
                throw new Error('Button is active (Raptor should be undocked)')
            }
            dockToScreen.trigger('click');
            if (!dockToScreen.is('.ui-state-highlight')) {
                throw new Error('Button not active (Raptor should be docked)')
            }
        });
    </script>
</body>
</html>
