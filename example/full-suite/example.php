<?php
    include __DIR__ . '/../include/content.php';
    $content = loadContent(__DIR__ . '/content.json');
?>
<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
    <?php include __DIR__ . '/../include/head.php'; ?>
    <title>Raptor Editor - Full Suite Example</title>
    <meta name="description" content="" />
    <meta name="author" content="" />

    <meta name="viewport" content="width=device-width,initial-scale=1" />

    <link rel="stylesheet" href="css/style.css" />

    <script src="js/libs/modernizr-2.0.6.min.js"></script>
    <?php $uri = '../../src/'; include '../../src/include.php'; ?>
    <script>
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
    <div id="header-container">
        <header class="wrapper clearfix">
            <h1 id="title" class="editable" data-id="site-title">
                <?php ob_start(); ?>
                Site Title
                <?= renderContent(ob_get_clean(), $content, 'site-title'); ?>
            </h1>
            <nav class="site-nav">
                <ul>
                    <li><a href="#">Link 1</a></li>
                    <li><a href="#">Other Link</a></li>
                    <li><a href="#">Last Link</a></li>
                </ul>
            </nav>
        </header>
    </div>
    <div id="main-container">
        <div id="main" class="wrapper clearfix">
            <article class="editable" data-id="article">
                <?php ob_start(); ?>
                <header>
                    <h1>Article Header H1</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sodales urna non odio egestas tempor. Nunc vel vehicula ante. Etiam bibendum iaculis libero, eget molestie nisl pharetra in. In semper consequat est, eu porta velit mollis nec.</p>
                </header>
                <section>
                    <h2>Article Section H2</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sodales urna non odio egestas tempor. Nunc vel vehicula ante. Etiam bibendum iaculis libero, eget molestie nisl pharetra in. In semper consequat est, eu porta velit mollis nec. Curabitur posuere enim eget turpis feugiat tempor. Etiam ullamcorper lorem dapibus velit suscipit ultrices. Proin in est sed erat facilisis pharetra.</p>
                    <img src="images/orange.jpg" />
                </section>
                <section>
                    <h2>Article Section H2</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sodales urna non odio egestas tempor. Nunc vel vehicula ante. Etiam bibendum iaculis libero, eget molestie nisl pharetra in. In semper consequat est, eu porta velit mollis nec. Curabitur posuere enim eget turpis feugiat tempor. Etiam ullamcorper lorem dapibus velit suscipit ultrices. Proin in est sed erat facilisis pharetra.</p>
                </section>
                <footer>
                    <h3>Article Footer h3</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sodales urna non odio egestas tempor. Nunc vel vehicula ante. Etiam bibendum iaculis libero, eget molestie nisl pharetra in. In semper consequat est, eu porta velit mollis nec. Curabitur posuere enim eget turpis feugiat tempor.</p>
                </footer>
                <?= renderContent(ob_get_clean(), $content, 'article'); ?>
            </article>

            <aside class="editable" data-id="side-bar">
                <?php ob_start(); ?>
                <h3>Side Bar</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sodales urna non odio egestas tempor. Nunc vel vehicula ante. Etiam bibendum iaculis libero, eget molestie nisl pharetra in. In semper consequat est, eu porta velit mollis nec. Curabitur posuere enim eget turpis feugiat tempor. Etiam ullamcorper lorem dapibus velit suscipit ultrices.</p>
                <?= renderContent(ob_get_clean(), $content, 'side-bar'); ?>
            </aside>

        </div> <!-- #main -->
    </div> <!-- #main-container -->

    <div id="footer-container">
        <footer class="wrapper editable" data-id="footer">
            <?php ob_start(); ?>
            <h3>Footer</h3>
            <?= renderContent(ob_get_clean(), $content, 'footer'); ?>
        </footer>
    </div>

</body>
</html>
