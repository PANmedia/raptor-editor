<?php
    include __DIR__ . '/../include/content.php';
    $content = loadContent(__DIR__ . '/content.json');
?>
<!doctype html>
<html>
<head>
    <?php include __DIR__ . '/../include/head.php'; ?>
    <link rel="stylesheet" href="../../codemirror/lib/codemirror.css" />
    <script src="../../tests/js/beautify-html.js"></script>
    <script src="../../codemirror/lib/codemirror.js"></script>
    <script src="../../codemirror/mode/javascript/javascript.js"></script>
    <script src="../../codemirror/mode/xml/xml.js"></script>
    <script src="../../codemirror/mode/css/css.js"></script>
    <script src="../../codemirror/mode/htmlmixed/htmlmixed.js"></script>
    <title>Raptor Editor - Live Source View</title>
    <script type="text/javascript">
        jQuery(function($) {
            $('tbody td').each(function() {
                var index = tableGetCellIndex(this);
                $(this).text($(this).text() + ' [' + index.x + ', ' + index.y + ']');
            });

            $('.editable').raptor({
                urlPrefix: '../../src/',
                plugins: {
                    dock: {
                        docked: true,
                        under: '.switcher'
                    },
                    classMenu: {
                        classes: {
                            'Blue background': 'cms-blue-bg',
                            'Round corners': 'cms-round-corners',
                            'Indent and center': 'cms-indent-center'
                        }
                    },
                    snippetMenu: {
                        snippets: {
                            'Grey Box': '<div class="grey-box"><h1>Grey Box</h1><ul><li>This is a list</li></ul></div>'
                        }
                    }
                }
            });
        });
    </script>
</head>
<body>
    <?php include __DIR__ . '/../include/nav.php'; ?>
    <header>
        <h1>Raptor Editor - Live Source View</h1>
    </header>
    <div style="clear: both"></div>
    <div class="editable half" data-id="body-1">
        <?php ob_start(); ?>
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
        <p>
            <span class="cms-blue">This text is blue.</span>
            <span class="cms-red">This text is red.</span>
            <span class="cms-green">This text is green.</span>
            <a href=".">This is an internal link.</a>
            <a href="http://www.raptor-editor.com" target="_blank">This is an external link.</a>
            <a href="mailto:info@raptor-editor.com?Subject=Example">This is an email link.</a>
            <strong class="cms-bold">This text is bold.</strong>
            <em class="cms-italic">This text is italic.</em>
        </p>

        <p>
            Text above the image.
            <img src="../full-suite/images/orange.jpg" />
            Text below the image.
        </p>
        <p>
            The image below is a link.
            <a href="http://www.raptor-editor.com">
                <img src="../full-suite/images/orange.jpg" />
            </a>
            The image above is a link.
        </p>

        <table>
            <tr>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
            </tr>
            <tr>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
            </tr>
            <tr>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
            </tr>
            <tr>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
            </tr>
            <tr>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
            </tr>
        </table>
        <?= renderContent(ob_get_clean(), $content, 'body-1'); ?>
    </div>
    <div class="source-view half">
        <pre class="soure-view-code"></pre>
    </div>
    <script type="text/javascript">
        var previousHtml = '';
        setInterval(function() {
            var html = $('.editable').data('uiRaptor').getHtml();
            if (html != previousHtml) {
                previousHtml = html;
                var prettyHtml = style_html(html, {
                    max_char: 0
                });
                if (typeof CodeMirror !== 'undefined') {
                    console.log('test');
                    $('.soure-view-code').html('');
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
