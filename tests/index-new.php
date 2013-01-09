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
            $array = [
                [
                    'name'=> 'alignment',
                    'description' => 'Tests the functionality of the alignment attributes of the toobar',
                    'tests' => [
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
                               ]
                ],
                [
                    'name'=> 'basic formatting',
                    'description' => 'Tests the functionality of the basic formatting attributes of the toobar',
                    'tests' => [
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
                               ]
                ]


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
                <div class="group">
                    <div class="number">
                            <input type="checkbox" name="" value="">1
                    </div>
                    <div class="group-header">
                        <div class="ui-widget ui-notification">
                            <div class="ui-state-confirmation ui-corner-all">
                                <p>
                                   <span class="ui-icon ui-icon-circle-check"></span>
                                   <strong>Group One</strong>
                                   <!--<span style="margin-left: 15.5em;" class="ui-icon ui-icon-information"></span>-->
                                   <strong>x/y tests passed</strong>
                                   <button name="run-group" class="test-button">Run Group Test</button>
                                </p>
                                <div class="description">
                                    the description for the group of tests could go here.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="item" style="display: none;">
                        <div class="number">
                                <input type="checkbox" name="" value="">1a
                        </div>
                        <div class="item-header">
                            <div class="ui-widget ui-notification">
                                <div class="ui-state-confirmation ui-corner-all">
                                    <p>
                                        <span class="ui-icon ui-icon-circle-check"></span>
                                        <strong>Grouped Item One</strong>
                                        <button name="run-test" class="test-button">Run Test</button>
                                        <!--<span style="margin-left: 19em;" class="ui-icon ui-icon-information"></span>-->
                                    </p>
                                    <div class="description">
                                        the description for the test could go here.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="item" style="display: none;">
                        <div class="number">
                                <input type="checkbox" name="" value="">1b
                        </div>
                        <div class="item-header">
                            <div class="ui-widget ui-notification">
                                <div class="ui-state-confirmation ui-corner-all">
                                    <p>
                                        <span class="ui-icon ui-icon-circle-check"></span>
                                        <strong>Grouped Item Two</strong>
                                        <button name="run-test" class="test-button">Run Test</button>
                                        <!--<span style="margin-left: 19em;" class="ui-icon ui-icon-information"></span>-->
                                    </p>
                                    <div class="description">
                                        the description for the test could go here.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div class="group">
                    <div class="number">
                            <input type="checkbox" name="" value="">2
                    </div>
                    <div class="group-header">
                        <div class="ui-widget ui-notification">
                            <div class="ui-state-default ui-corner-all">
                                <p>
                                   <span class="ui-icon ui-icon-circle-check"></span>
                                   <strong>Group One</strong>
                                   <!--<span style="margin-left: 15.5em;" class="ui-icon ui-icon-information"></span>-->
                                   <strong>x/y tests passed</strong>
                                   <button name="run-group" class="test-button">Run Group Test</button>
                                </p>
                                <div class="description">
                                    the description for the group of tests could go here.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="item" style="display: none;">
                        <div class="number">
                                <input type="checkbox" name="" value="">2a
                        </div>
                        <div class="item-header">
                            <div class="ui-widget ui-notification">
                                <div class="ui-state-default ui-corner-all">
                                    <p>
                                        <span class="ui-icon ui-icon-circle-check"></span>
                                        <strong>Grouped Item One</strong>
                                        <button name="run-test" class="test-button">Run Test</button>
                                        <!--<span style="margin-left: 19em;" class="ui-icon ui-icon-information"></span>-->
                                    </p>
                                    <div class="description">
                                        the description for the test could go here.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="item" style="display: none;">
                        <div class="number">
                                <input type="checkbox" name="" value="">2b
                        </div>
                        <div class="item-header">
                            <div class="ui-widget ui-notification">
                                <div class="ui-state-default ui-corner-all">
                                    <p>
                                        <span class="ui-icon ui-icon-circle-check"></span>
                                        <strong>Grouped Item Two</strong>
                                        <button name="run-test" class="test-button">Run Test</button>
                                        <!--<span style="margin-left: 19em;" class="ui-icon ui-icon-information"></span>-->
                                    </p>
                                    <div class="description">
                                        the description for the test could go here.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div class="group">
                    <div class="number">
                            <input type="checkbox" name="" value="">3
                    </div>
                    <div class="group-header">
                        <div class="ui-widget ui-notification">
                            <div class="ui-state-warning ui-corner-all">
                                <p>
                                   <span class="ui-icon ui-icon-circle-check"></span>
                                   <strong>Group One</strong>
                                   <!--<span style="margin-left: 15.5em;" class="ui-icon ui-icon-information"></span>-->
                                   <strong>x/y tests passed</strong>
                                   <button name="run-group" class="test-button">Run Group Test</button>
                                </p>
                                <div class="description">
                                    the description for the group of tests could go here.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="item" style="display: none;">
                        <div class="number">
                                <input type="checkbox" name="" value="">3a
                        </div>
                        <div class="item-header">
                            <div class="ui-widget ui-notification">
                                <div class="ui-state-warning ui-corner-all">
                                    <p>
                                        <span class="ui-icon ui-icon-circle-check"></span>
                                        <strong>Grouped Item One</strong>
                                        <button name="run-test" class="test-button">Run Test</button>
                                        <!--<span style="margin-left: 19em;" class="ui-icon ui-icon-information"></span>-->
                                    </p>
                                    <div class="description">
                                        the description for the test could go here.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="item" style="display: none;">
                        <div class="number">
                                <input type="checkbox" name="" value="">3b
                        </div>
                        <div class="item-header">
                            <div class="ui-widget ui-notification">
                                <div class="ui-state-warning ui-corner-all">
                                    <p>
                                        <span class="ui-icon ui-icon-circle-check"></span>
                                        <strong>Grouped Item Two</strong>
                                        <button name="run-test" class="test-button">Run Test</button>
                                        <!--<span style="margin-left: 19em;" class="ui-icon ui-icon-information"></span>-->
                                    </p>
                                    <div class="description">
                                        the description for the test could go here.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div class="group">
                    <div class="number">
                            <input type="checkbox" name="" value="">4
                    </div>
                    <div class="group-header">
                        <div class="ui-widget ui-notification">
                            <div class="ui-state-error ui-corner-all">
                                <p>
                                   <span class="ui-icon ui-icon-circle-check"></span>
                                   <strong>Group One</strong>
                                   <!--<span style="margin-left: 15.5em;" class="ui-icon ui-icon-information"></span>-->
                                   <strong>x/y tests passed</strong>
                                   <button name="run-group" class="test-button">Run Group Test</button>
                                </p>
                                <div class="description">
                                    the description for the group of tests could go here.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="item" style="display: none;">
                        <div class="number">
                                <input type="checkbox" name="" value="">4a
                        </div>
                        <div class="item-header">
                            <div class="ui-widget ui-notification">
                                <div class="ui-state-error ui-corner-all">
                                    <p>
                                        <span class="ui-icon ui-icon-circle-check"></span>
                                        <strong>Grouped Item One</strong>
                                        <button name="run-test" class="test-button">Run Test</button>
                                        <!--<span style="margin-left: 19em;" class="ui-icon ui-icon-information"></span>-->
                                    </p>
                                    <div class="description">
                                        the description for the test could go here.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="item" style="display: none;">
                        <div class="number">
                                <input type="checkbox" name="" value="">4b
                        </div>
                        <div class="item-header">
                            <div class="ui-widget ui-notification">
                                <div class="ui-state-error ui-corner-all">
                                    <p>
                                        <span class="ui-icon ui-icon-circle-check"></span>
                                        <strong>Grouped Item Two</strong>
                                        <button name="run-test" class="test-button">Run Test</button>
                                        <!--<span style="margin-left: 19em;" class="ui-icon ui-icon-information"></span>-->
                                    </p>
                                    <div class="description">
                                        the description for the test could go here.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>
            </div>
            <button name="run-all">Run All Tests</button>
            <button name="run-selected">Run Selected Tests</button>
            This may take several minutes
        </div>
    </body>
</html>
