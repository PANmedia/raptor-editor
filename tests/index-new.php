<?php
    if (!isset($baseURI)) {
        $baseURI = '';
    }
?>
<!doctype html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="cache-control" content="no-cache" />
        <base href="<?= $baseURI ?>"/>
        <link type="text/css" rel="stylesheet" href="css/theme.css"/>
        <link type="text/css" rel="stylesheet" href="css/theme.icons.datauri.css"/>
        <link type="text/css" rel="stylesheet" href="css/tests.css"/>
        <script src="index-new-js-stuff.js"></script>
        <script src="../src/dependencies/jquery.js"></script>

        <script>
        $(function() {

            //Updates the summary
            getSummary();

            //Runs the closest test when the Run Test button is clicked
            $('.run-test').click(function() {
                var group = $($(this).parentsUntil($('.tests'))).last(),
                        path = group.data('path'),
                        item = $($(this).parentsUntil($('.group'))).last(),
                        fileName = item.data('fileName');
                queueTest(path, fileName);

            });

            //Runs the closest group of tests when the Run Group button is clicked
            $('.run-group').click(function() {
                var group = $($(this).parentsUntil($('.tests'))).last(),
                            path = group.data('path');

                    $(group).find('.item').each(function() {
                        queueTest(path, $(this).data('fileName'));
                    });
                    return false;
                });

                //Runs all of the tests when the Run All button is clicked
                $('.run-all').click(function() {
                    var content = $(this).parents('.content');

                    $(content).find('.group').each(function() {
                        var path = $(this).data('path');

                        $(this).find('.item').each(function() {
                            queueTest(path, $(this).data('fileName'));
                        });
                    });
                });

                //Runs any tests that the user has selected when the Run Selected button has been clicked
                $('.run-selected').click(function() {
                    var content = $(this).parents('.content');

                    $(content).find('.group').each(function() {
                        var path = $(this).data('path');

                        $(this).find('.item').each(function() {
                            if (($(this).find('.item-check')).is(':checked')) {
                                queueTest(path, $(this).data('fileName'));
                            }
                        });
                    });
                });

                //Selects all the items of the group when the group is selected
                $('.group-check').change(function() {
                    if ($(this).is(':checked')) {
                        $($(this).closest('.group').find('.item-check')).attr('checked', true);
                    } else {
                        $($(this).closest('.group').find('.item-check')).attr('checked', false);
                    }
                });

                //Opens a new tab and displays the test results of the closest item in it
                $('.view-test').click(function() {
                    var path = $(this).closest('.group').data('path'),
                            filename = $(this).closest('.item').data('fileName');

                    window.open('cases/' + path + '/' + filename);
                });

                //When the user clicks on a group header all the items of that group are displayed
                $('.group-header').click(function() {
                    var item = $(this).siblings('.item');
                    if (!item.is(':visible')) {
                        item.show();
                    } else {
                        item.hide();
                    }
                });
            });
        </script>
    </head>
    <body>
        <?php
        include 'index-new-php-stuff.php';
        if (!empty($warnings)): ?>
            <h2>Warnings: </h2>
            <ul>
                <?php foreach ($warnings as $warning): ?>
                    <li><?= $warning ?></li>
                <?php endforeach; ?>
            </ul>
        <?php endif;?>
        <h2>Tests: </h2>
        <div class="content">
            <div class="summary"></div>
            <div class="buttons">
                <button class="run-all">Run All Tests</button>
                <button class="run-selected">Run Selected Tests</button><br/>
                This may take several minutes
            </div>
            <div class="clear"></div>
            <div class="tests">
                <?php
                $i=1;
                foreach ($groups as $group): ?>
                <div class="group" data-path="<?= $group['path'] ?>">
                    <div class="number">
                        <input class="group-check" type="checkbox"><?= $i ?>
                    </div>
                    <div class="group-header">
                        <div class="ui-widget ui-notification">
                            <div class="group-content ui-state-default ui-corner-all">
                                <button class="test-button run-group">Run Group</button>
                                <span class="icon ui-icon"></span>
                                <div class="title">
                                    <strong><?= $group['name'] ?></strong>
                                    <span class="group-pass-fail-ratio" style="display: none;"><span class="group-passes">0</span>/<?= sizeof($group['tests']) ?> items passed</span>
                                </div>
                                <div class="description">
                                    <p><?= $group['description'] ?></p>
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>
                    </div>
                    <?php
                    $k = 0;
                    foreach ($group["tests"] as $item): ?>
                    <div class="item" style="display: none;" data-file-name="<?= $item['filename'] ?>">
                        <div class="number">
                            <input class="item-check" type="checkbox"><?= $i . chr(97 + $k++) ?>
                        </div>
                        <div class="item-header">
                            <div class="ui-widget ui-notification">
                                <div class="item-content ui-state-default ui-corner-all" >
                                    <button class="test-button run-test">Run Test</button>
                                    <button class="test-button view-test">View Test</button>
                                    <span class="icon ui-icon"></span>
                                    <div class="title">
                                        <strong><?= $item['name'] ?></strong>
                                        <span class="items-pass-fail-ratio" style="display: none;"></span>
                                    </div>
                                    <div class="description">
                                        <?= $item['description'] ?>
                                    </div>
                                    <div class="error-message" style="display: none;"></div>
                                    <div class="clear"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                <div class="clear"></div>
                <?php $i++; endforeach; ?>
            </div>
            <div class="buttons">
                <button class="run-all">Run All Tests</button>
                <button class="run-selected">Run Selected Tests</button>
                This may take several minutes
            </div>
            <div class="iframes"></div>
        </div>
    </body>
</html>
