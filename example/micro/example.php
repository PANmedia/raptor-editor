<?php
    include __DIR__ . '/../include/content.php';
    $content = loadContent(__DIR__ . '/content.json');
?>
<!doctype html>
<html>
<head>
    <?php include __DIR__ . '/../include/head.php'; ?>
    <title>Raptor Editor - Micro Example</title>
    <script type="text/javascript">
        // Test for no conflict version
        var init;
        if (typeof raptor !== 'undefined') {
            init = raptor;
        } else if (typeof jQuery !== 'undefined') {
            init = jQuery;
        } else {
            alert('Could not find initialiser');
        }
        init(function($) {
            $('.editable').raptor({
                urlPrefix: '../../src/',
                preset: 'micro'
            });
        });
    </script>
</head>
<body>
    <?php include __DIR__ . '/../include/nav.php'; ?>
    <div class="half center">
        <h1 class="editable">Raptor Editor - Micro Example</h1>
        <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
        </p>
        <p>
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
            when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
        </p>
        <p>
            It has survived not only five centuries, but also the leap into electronic typesetting, 
            remaining essentially unchanged. 
        </p>
    </div>
</body>
</html>
