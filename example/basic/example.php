<?php
    include __DIR__ . '/../include/content.php';
    $content = loadContent(__DIR__ . '/content.json');
?>
<!doctype html>
<html>
<head>
    <?php include __DIR__ . '/../include/head.php'; ?>
    <title>Raptor Editor - Basic Example</title>
    <script type="text/javascript">
        jQuery(function($) {
            $('.editable').raptor({
                urlPrefix: '../../src/',
                plugins: {
                    save: {
                        plugin: 'saveJson'
                    },
                    saveJson: {
                        url: 'save.php',
                        postName: 'raptor-content',
                        id: function() {
                            return this.raptor.getElement().data('id');
                        }
                    },
                    dock: {
                        docked: true,
                        under: '.switcher-spacer'
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
    <style type="text/css">
        table {
            width: 100%;
            /*-webkit-user-select: none;*/
        }
        td, th {
            border: 1px dotted #777;
        }

        div.editable {
            float: left;
            width: 45%;
            margin: 0 1%;
        }
    </style>
</head>
<body>
    <?php include __DIR__ . '/../include/nav.php'; ?>
    <header>
        <h1>Raptor Editor - Basic Example</h1>
    </header>
    <div style="clear: both"></div>
    <div class="editable" data-id="body-1">
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

        <ul>
            <li>
                <p>List item 1</p>
            </li>
            <li>
                <p>List item 2</p>
            </li>
            <li>
                <p>List item 3</p>
            </li>
        </ul>

        <ol>
            <li>
                <p>List item 1</p>
            </li>
            <li>
                <p>List item 2</p>
            </li>
            <li>
                <p>List item 3</p>
            </li>
        </ol>

        <p>
            Text above the image.
            <img src="../full-suite/images/orange.jpg" width="100" />
            Text below the image.
        </p>
        <p>
            The image below is a link.
            <a href="http://www.raptor-editor.com">
                <img src="../full-suite/images/orange.jpg" width="100" />
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

    <div class="editable" data-id="body-2">
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
        <?= renderContent(ob_get_clean(), $content, 'body-2'); ?>
    </div>

</body>
</html>
