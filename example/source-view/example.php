<?php
    $type = isset($_GET['type']) ? $_GET['type'] : 'include';
?>
<!doctype html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <title>Raptor Editor - Save Rest Example</title>
    <link rel="stylesheet" href="../assets/style.css" />
    <script src="../../tests/js/beautify-html.js"></script>
    <script src="../codemirror/lib/codemirror.js"></script>
    <script src="../codemirror/mode/javascript/javascript.js"></script>
    <script src="../codemirror/mode/xml/xml.js"></script>
    <script src="../codemirror/mode/css/css.js"></script>
    <script src="../codemirror/mode/htmlmixed/htmlmixed.js"></script>
    <?php if ($type === 'light'): ?>
        <link rel="stylesheet" href="../../src/dependencies/themes/aristo/jquery-ui.css" />
        <link rel="stylesheet" href="../../src/theme/theme.css" />
        <script src="../../src/dependencies/jquery.js"></script>
        <script src="../../src/dependencies/jquery-ui.js"></script>
        <script src="../../packages/raptor.light.min.js"></script>
    <?php elseif ($type === 'rails'): ?>
        <link rel="stylesheet" type="text/css" href="../../src/dependencies/themes/redmond/jquery-ui.css" />
        <script src="../../src/dependencies/jquery.js"></script>
        <script src="../../src/dependencies/jquery-ui.js"></script>
        <script src="../../packages/raptor.rails.js"></script>
    <?php elseif ($type === 'include'): ?>
        <?php $uri = '../../src/'; include '../../src/include.php'; ?>
    <?php endif; ?>
    <script type="text/javascript">
        jQuery(function($) {
            $('.editable').raptor({
                urlPrefix: '../../src/',
                ui: {
                    classMenu: {
                        classes: {
                            'Blue background': 'cms-blue-bg',
                            'Round corners': 'cms-round-corners',
                            'Indent and center': 'cms-indent-center',
                            'Test': 'cms-center'
                        }
                    }
                }
            });
        });
    </script>
    <script type="text/javascript">
        $(function() {
            $('tbody td').each(function() {
                var index = tableGetCellIndex(this);
                $(this).text($(this).text() + ' [' + index.x + ', ' + index.y + ']');
            });
        });
    </script>
    <style type="text/css">
        table {
            width: 100%;
            /*-webkit-user-select: none;*/
        }
        td, th {
            border: 1px dotted #777;
        }

        div.half {
            float: left;
            width: 45%;
            margin: 0 1%;
        }
    </style>
</head>
<body>
    <nav>
        <a href="?">Include</a>
        <a href="?type=default">Default</a>
        <a href="?type=light">Light</a>
        <a href="?type=rails">Rails</a>
        <a href="?type=0deps">0 dependencies</a>
        <a href="?type=0depsnc">0 dependencies, no conflict</a>
    </nav>
    <header >
        <h1>Raptor Editor - Live Source View</h1>
    </header>
    <div class="editable half" data-id="body-1">
        <?php ob_start(); ?>
        <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard dummy text ever since the 1500s, when an unknown printer
            took a galley of type and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
            Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker
            including versions of Lorem Ipsum.
        </p>
        <p>
            <span class="cms-blue">This text is blue.</span>
            <span class="cms-red">This text is red.</span>
            <span class="cms-green">This text is green.</span>
            <a href=".">This is a link.</a>
            <strong class="cms-bold">This text is bold.</strong>
            <i class="cms-italic">This text is italic.</i>
        </p>
        <?php
            $buffer = ob_get_clean();
            if (isset($content['body-1'])) {
                echo $content['body-1'];
            } else {
                echo $buffer;
            }
        ?>
    </div>
    <div class="source-view half">
        <pre class="soure-view-code"></pre>
    </div>
    <script type="text/javascript">
        var previousHtml = '';
        setInterval(function() {
            var html = $('.editable').data('raptor').getHtml();
            if (html != previousHtml) {
                previousHtml = html;
                var prettyHtml = style_html(html, {
                    max_char: 0
                });
                if (typeof CodeMirror !== 'undefined') {
                    CodeMirror($('.soure-view-code').get(0), {
                        value: prettyHtml,
                        mode: 'htmlmixed'
                    });
                } else {
                    $('.soure-view-code').text(prettyHtml);
                }
            }
        }, 400);
    </script>
</body>
</html>
