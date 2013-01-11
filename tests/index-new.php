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

            function runTest(path){
                $('<iframe>')
                    .attr('src', path)
                    .load(function() {
                        timerId = setInterval(checkStatus, 100, this.contentWindow.testResults);
                    })
                    .appendTo('.iframes');
            }

            function checkStatus(testResults) {
                if (testResults.count === testResults.tests.length) {
                    clearInterval(timerId);
                    timerId = null;

                    for(var i=0; i <= testResults.count; i++){
                        //for each result in the set of results check vv and if there is one fail then set group header to .ui-state-error and the cross icon
                        if(testResults.tests[i]['status'] === 'pass'){
                            //set the first item header to have the class .ui-state-confirmation and the check icon
                            document.getElementById('item').className() = 'ui-state-confirmation ui-corner-all';
                            console.log('test ' + i + ' passed');
                        }else if(testResults.tests[i]['status'] === 'fail'){
                            //set the first item header to have the class .ui-state-error and the cross icon
                            document.getElementById('item').className() = 'ui-state-error ui-corner-all';
                            console.log('test ' + i + ' failed');
                        }//else if (the test is processing){
                            //set the first item header to have the class .ui-state-warning and a refresh icon??
                        //}
                        //else if (the test hasn't been processed yet){
                            //set the first item header to have the class .ui-state-default
                        //}
                        ;
                    }
                }
                return;
            }

            $(function() {
                $('.group-header').click(function() {
                    var item = $(this).siblings('.item');
                    if (!item.is(':visible')) {
                        item.show();
                    } else {
                        item.hide();
                    }
                });
                runTest('cases/block-quote/insert-blockquote-button.php');
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
                <div class="group">
                    <div class="number">
                        <input type="checkbox" name="" value=""><?= $i ?>
                    </div>
                    <div class="group-header">
                        <div class="ui-widget ui-notification">
                            <div id ="group" class="ui-state-default ui-corner-all">
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
                    <?php
                    $k = 0;
                    foreach ($group["tests"] as $item): ?>
                    <div class="item" style="display: none;">
                        <div class="number">
                            <input type="checkbox" name="" value=""><?= $i . $j[$k] ?>
                        </div>
                        <div class="item-header">
                            <div class="ui-widget ui-notification">
                                <div id ="item" class="ui-state-default ui-corner-all">
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
