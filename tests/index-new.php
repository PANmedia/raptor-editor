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
            var timerID = null;

            function setGroupStatus(path, state, icon) {
                var group = $('.group[data-path="' + path + '"]').find('.group-content'),
                    groupIcon = group.find('.icon');

                    checkState(group, groupIcon, state, icon);
            }

            function setItemStatus(path, fileName, state, icon) {
                var item = $('.group[data-path="' + path + '"]').find('.item[data-file-name="' + fileName + '"]').find('.item-content'),
                    itemIcon = item.find('.icon');

                    checkState(item, itemIcon, state, icon);
            }

            function checkState(content, currentIcon, state, icon){
                content
                    .removeClass('ui-state-default ui-state-warning ui-state-error ui-state-confirmation')
                    .addClass(state);
                currentIcon
                    .removeClass('ui-icon-clock ui-icon-circle-check ui-icon-circle-close')
                    .addClass(icon);
            }

            function runTest(path, fileName) {
                setGroupStatus(path, 'ui-state-warning', 'ui-icon-clock');
                setItemStatus(path, fileName, 'ui-state-warning', 'ui-icon-clock');

                $('<iframe>')
                    .attr('src', 'cases/' + path + '/' + fileName)
                    .load(function() {
                        timerId = setInterval(checkStatus, 100, this.contentWindow.testResults, path, fileName);
                    })
                    .appendTo('.iframes');
            }

            function checkStatus(testResults, path, fileName) {
                if (testResults.count === testResults.tests.length) {
                    clearInterval(timerId);
                    timerId = null;

                    var pass = true;
                    for (var i = 0; i < testResults.tests.length; i++) {
                        if (testResults.tests[i]['status'] !== 'pass') {
                            pass = false;
                            break;
                        }
                    }
                    //need to add in counter to check how many have passed and display it in the group header and the item header
                    if (pass) {
                        setItemStatus(path, fileName, 'ui-state-confirmation', 'ui-icon-circle-check');
                    } else {
                        setItemStatus(path, fileName, 'ui-state-error', 'ui-icon-circle-close');
                    }

                        $('iframe').remove();
                }
            }
            $(document).ready(function(){
                $('.run-test').click(function(){
                  runTest('',''); //get path and filename of test
                });
              });

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

            $csv_file_content = file_get_contents('tests.csv');
            $lines = explode("\n", $csv_file_content);
            $head = str_getcsv(array_shift($lines));

            $csv_data = array();
            foreach ($lines as $line) {
                $row_data = array_combine($head, str_getcsv($line));
                $csv_data[$row_data['Folder'] . '/' . $row_data['File Name']] = $row_data;
            }

            $warnings = [];
            $groups = [];
            $findTests = function($case) use($csv_data, &$warnings) {
                $tests = [];
                foreach (glob($case . '/*.*') as $file) {
                    $index = basename($case) . '/' . basename($file);
                    if (!isset($csv_data[$index])) {
                        $warnings[] = 'No description found for: ' . $index;
                        continue;
                    }
                    $tests[] = [
                        'name' => $csv_data[$index]['Name'],
                        'filename' => basename($file),
                        'description' => $csv_data[$index]['Description'],
                        'status' => $csv_data[$index]['Status'],
                    ];
                }
                return $tests;
            };
            foreach (glob(__DIR__ . '/cases/*') as $case) {
                $groups[] = [
                    'name' => basename($case),
                    'path' => basename($case),
                    'description' => '',
                    'tests' => $findTests($case),
                ];
            }

            $j = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        ?>

    </head>
    <body>
        <?php if (!empty($warnings)): ?>
            <h2>Warnings: </h2>
            <ul>
                <?php foreach ($warnings as $warning): ?>
                    <li><?= $warning ?></li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>
        <h2>Tests: </h2>
        <div class="content">
            <div class="iframes"></div>
            <button name="run-all">Run All Tests</button>
            <button name="run-selected">Run Selected Tests</button>
            This may take several minutes
            <div class="tests">
                <?php
                $i=1;
                foreach ($groups as $group): ?>
                <div class="group" data-path="<?= $group['path'] ?>">
                    <div class="number">
                        <input type="checkbox"><?= $i ?>
                    </div>
                    <div class="group-header">
                        <div class="ui-widget ui-notification">
                            <div class="group-content ui-state-default ui-corner-all">
                                <p>
                                    <span class="icon ui-icon"></span>
                                    <strong><?= $group['name'] ?></strong>
                                    <span class="pass-fail-ratio">x/y items passed</span>
                                    <button class="test-button run-group">Run Group Test</button>
                                </p>
                                <div class="description">
                                    <?= $group['description'] ?>
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php
                    $k = 0;
                    foreach ($group["tests"] as $item): ?>
                    <div class="item" style="display: none;" data-file-name="">
                        <div class="number">
                            <input type="checkbox"><?= $i . $j[$k] ?>
                        </div>
                        <div class="item-header">
                            <div class="ui-widget ui-notification">
                                <div class="item-content ui-state-default ui-corner-all" >
                                    <p>
                                        <span class="icon ui-icon"></span>
                                        <strong><?= $item['name'] ?></strong>
                                        <span class="pass-fail-ratio">x/y tests passed</span>
                                        <button class="test-button run-test">Run Test</button>
                                    </p>
                                    <div class="description">
                                        <?= $item['description'] ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php $k ++; endforeach; ?>
                </div>
                <div class="clear"></div>
                <?php $i++; endforeach; ?>
            </div>

            <button name="run-all">Run All Tests</button>
            <button name="run-selected">Run Selected Tests</button>
            This may take several minutes
        </div>
    </body>
</html>
