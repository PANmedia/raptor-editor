<!doctype html>
<html>
<head>
    <?php include __DIR__ . '/../include/head.php'; ?>
    <script type="text/javascript">
        jQuery(function($) {
            $('.editable').raptor({
                urlPrefix: '../../src/',
                plugins: {
                    dock: {
                        docked: true,
                        under: '.spacer'
                    }
                }
            });
        });
    </script>
    <style type="text/css">
        .spacer,
        .spacer-float {
            height: 100px;
        }
        .spacer-float {
            text-align: center;
            background-color: darkorange;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
        }
    </style>
</head>
<body>
    <div class="spacer"></div>
    <div class="spacer-float">
        This is the spacer.
    </div>
    <?php include __DIR__ . '/../include/nav.php'; ?>
    <header class="editable" data-id="header">
        <h1>Raptor Editor - Dock Example</h1>
    </header>
    <div style="clear: both"></div>
    <div class="editable" data-id="body-1">
        <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard dummy text ever since the 1500s, when an unknown printer
            took a galley of type and scrambled it to make a type specimen book.
        </p>
        <blockquote>
            <p>
                It has survived not only five centuries, but also the leap into electronic typesetting,
                remaining essentially unchanged.
            </p>
        </blockquote>
        <p>
            It was popularised in the 1960s with the release of Letraset sheets containing
            Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker
            including versions of Lorem Ipsum.
        </p>
    </div>
</body>
</html>
