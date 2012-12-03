<!doctype html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="cache-control" content="no-cache" />
        <link type="text/css" rel="stylesheet" href="css/style.css"/>
        <script src="../src/dependencies/jquery.js"></script>
        <script type="text/javascript">
            $(function() {
                function iframeResize() {
                    $(this).height($($(this).get(0).contentDocument).find('html').outerHeight());
                }

                function iframeAdd(src) {
                    $('<iframe>')
                        .attr('src', src)
                        .load(iframeResize)
                        .appendTo('.iframes');
                }

                $('[name=run-all]').click(function() {
                    $('iframe').remove();
                    var time = 0;
                    $('.tests a').each(function() {
                        setTimeout(function() {
                            iframeAdd($(this).attr('href'));
                        }.bind(this), time += 50);
                    });
                });

                $('[name=verbose]').change(function() {
                    $('iframe').each(function() {
                        $('body', $(this).get(0).contentDocument).toggleClass('verbose').toggleClass('simple');
                        iframeResize.call(this);
                    });
                });

                $('nav a').click(function(event) {
                    if (event.which === 1) {
                        $('iframe').remove();
                        iframeAdd($(this).attr('href'));
                        return false;
                    }
                });
            });
        </script>
    </head>
    <body>
        <aside>
            <h1>Tests:</h1>
            <div>
                <button name="run-all">Run All</button>
                <input type="checkbox" name="verbose" id="verbose" />
                <label for="verbose">Verbose Output</label>
            </div>
            <nav class="tests">
                <?php
                    $findTests = function($case) {
                        foreach (glob($case . '/*.*') as $file) {
                            echo '<a target="test" href="cases/' . basename($case) . '/' . basename($file) . '">' . basename($case) . ' - ' . basename($file) . '</a>';
                        }
                    };
                    foreach (glob(__DIR__ . '/cases/*') as $case) {
                        $findTests($case);
                    }
                ?>
            </nav>
        </aside>
        <div class="iframes">
            <iframe id="test" name="test" src="test.html"></iframe>
        </div>
    </body>
</html>
