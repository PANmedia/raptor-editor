<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

    <title></title>
    <meta name="description" content="" />
    <meta name="author" content="" />

    <meta name="viewport" content="width=device-width,initial-scale=1" />

    <link rel="stylesheet" href="css/style.css" />

    <script src="js/libs/modernizr-2.0.6.min.js"></script>
    <?php $uri = '../../src/'; include '../../src/include.php'; ?>
    <script>
        jQuery(function($) {
            $('.editable').editor({
                urlPrefix: '../../src/'
            });
        });
    </script>
</head>
<body>
    <div id="header-container">
        <header class="wrapper clearfix">
            <h1 id="title" class="editable">Site Title</h1>
            <nav>
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

            <article class="editable">
                <header>
                    <h1>Article Header H1</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sodales urna non odio egestas tempor. Nunc vel vehicula ante. Etiam bibendum iaculis libero, eget molestie nisl pharetra in. In semper consequat est, eu porta velit mollis nec.</p>
                </header>
                <section>
                    <h2>Article Section H2</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sodales urna non odio egestas tempor. Nunc vel vehicula ante. Etiam bibendum iaculis libero, eget molestie nisl pharetra in. In semper consequat est, eu porta velit mollis nec. Curabitur posuere enim eget turpis feugiat tempor. Etiam ullamcorper lorem dapibus velit suscipit ultrices. Proin in est sed erat facilisis pharetra.</p>
                </section>
                <section>
                    <h2>Article Section H2</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sodales urna non odio egestas tempor. Nunc vel vehicula ante. Etiam bibendum iaculis libero, eget molestie nisl pharetra in. In semper consequat est, eu porta velit mollis nec. Curabitur posuere enim eget turpis feugiat tempor. Etiam ullamcorper lorem dapibus velit suscipit ultrices. Proin in est sed erat facilisis pharetra.</p>
                </section>
                <footer>
                    <h3>Article Footer h3</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sodales urna non odio egestas tempor. Nunc vel vehicula ante. Etiam bibendum iaculis libero, eget molestie nisl pharetra in. In semper consequat est, eu porta velit mollis nec. Curabitur posuere enim eget turpis feugiat tempor.</p>
                </footer>
            </article>

            <aside class="editable">
                <h3>Side Bar</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sodales urna non odio egestas tempor. Nunc vel vehicula ante. Etiam bibendum iaculis libero, eget molestie nisl pharetra in. In semper consequat est, eu porta velit mollis nec. Curabitur posuere enim eget turpis feugiat tempor. Etiam ullamcorper lorem dapibus velit suscipit ultrices.</p>
            </aside>

        </div> <!-- #main -->
    </div> <!-- #main-container -->

    <div id="footer-container">
        <footer class="wrapper editable">
            <h3>Footer</h3>
        </footer>
    </div>

</body>
</html>
