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
        <script src="../src/dependencies/jquery.js"></script>

        <script>
            $(function() {
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

        <?php
            $groups = [
                [
                    'name' => 'alignment',
                    'description' => 'Tests the functionality of the alignment attributes of the toobar',
                    'tests' => [
                        [
                            'name' => 'center align',
                            'filename' => 'center-align-button.php',
                            'description' => 'Tests the functionality of the center align text button on the toolbar',
                            'status' => 'pass',
                        ],
                        [
                            'name' => 'left align',
                            'filename' => 'left-align-button.php',
                            'description' => 'Tests the functionality of the left align text button on the toolbar',
                            'status' => 'fail',
                        ],
                        [
                            'name' => 'right align',
                            'filename' => 'right-align-button.php',
                            'description' => 'Tests the functionality of the right align text button on the toolbar',
                            'status' => 'pass',
                        ],
                    ],
                ],
                [
                    'name' => 'basic formatting',
                    'description' => 'Tests the functionality of the basic formatting attributes of the toobar',
                    'tests' => [
                        [
                            'name' => 'bold button',
                            'filename' => 'bold-button.php',
                            'description' => 'Tests the bold button turns text bold',
                            'status' => 'pass',
                        ],
                        [
                            'name' => 'italic button',
                            'filename' => 'italic-button.php',
                            'description' => 'Tests the bold button turns text bold',
                            'status' => 'fail',
                        ],
                        [
                            'name' => 'strike button',
                            'filename' => 'strike-button.php',
                            'description' => 'Tests the bold button turns text bold',
                            'status' => 'pass',
                        ],
                    ],
                ],
            ];
        ?>

    </head>
    <body>
        <h2>Tests: </h2>
        <div class="content">
            <button name="run-all">Run All Tests</button>
            <button name="run-selected">Run Selected Tests</button>
            This may take several minutes
            <div class="tests">
                <?php foreach ($groups as $group): ?>
                <div class="group">
                    <div class="number">
                        <input type="checkbox" name="" value="">1
                    </div>
                    <div class="group-header">
                        <div class="ui-widget ui-notification">
                            <div class="ui-state-default ui-corner-all">
                                <p>
                                    <!--<span class="ui-icon ui-icon-circle-check"></span>-->
                                    <strong><?= $group['name'] ?></strong>
                                    <!--<span style="margin-left: 15.5em;" class="ui-icon ui-icon-information"></span>-->
                                    <strong>x/y tests passed</strong>
                                    <button name="run-group" class="test-button">Run Group Test</button>
                                </p>
                                <div class="description">
                                    <?= $group['description'] ?>
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php foreach ($group["tests"] as $item): ?>
                    <div class="item" style="display: none;">
                        <div class="number">
                            <input type="checkbox" name="" value="">1a
                        </div>
                        <div class="item-header">
                            <div class="ui-widget ui-notification">
                                <div class="ui-state-default ui-corner-all">
                                    <p>
                                        <!--<span class="ui-icon ui-icon-circle-check"></span>-->
                                        <strong><?= $item['name'] ?></strong>
                                        <button name="run-test" class="test-button">Run Test</button>
                                        <!--<span style="margin-left: 19em;" class="ui-icon ui-icon-information"></span>-->
                                    </p>
                                    <div class="description">
                                        <?= $item['description'] ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                <div class="clear"></div>
                <?php endforeach; ?>
            </div>

            <button name="run-all">Run All Tests</button>
            <button name="run-selected">Run Selected Tests</button>
            This may take several minutes
        </div>
    </body>
</html>
