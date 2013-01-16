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
            var queue = [];
            var testRunning = false;

            function setGroupStatus(path, state, icon, itemsPassed)  {
                var group = $('.group[data-path="' + path + '"]'),
                    groupContent = group.find('.group-content'),
                    groupIcon = groupContent.find('.icon'),
                    groupRatio = groupContent.find('.group-pass-fail-ratio'),
                    passed = groupRatio.find('.group-passes');

                 $(groupRatio).css('display','');

                passed.html(itemsPassed);

                checkState(groupContent, groupIcon, state, icon);
            }


            function setItemStatus(path, fileName, state, icon, passes, testLength) {
                var item = $('.group[data-path="' + path + '"]').find('.item[data-file-name="' + fileName + '"]').find('.item-content'),
                    itemIcon = item.find('.icon'),
                    itemRatio = item.find('.items-pass-fail-ratio');

                itemRatio.html( passes + '/' + testLength + ' tests passed');

                checkState(item, itemIcon, state, icon);

                var itemsPassed = 0; //needs to count how many items in that group have passed
                var status = 'pass';
                item.closest('.group').find('.item-content').each(function() {
                    if ($(this).hasClass('ui-state-warning')) {
                        status = 'loading';
                        return false;
                    } else if ($(this).hasClass('ui-state-error')) {
                        status = 'fail';
                    } else {
                        itemsPassed++;
                    }
                });

                if (status === 'pass') {
                    setGroupStatus(path, 'ui-state-confirmation', 'ui-icon-circle-check', itemsPassed);
                } else if (status === 'fail') {
                    setGroupStatus(path, 'ui-state-error', 'ui-icon-circle-close', itemsPassed);
                } else if (status === 'loading') {
                    setGroupStatus(path, 'ui-state-warning', 'ui-icon-clock');
                }

            }

            function checkState(content, currentIcon, state, icon) {
                content
                    .removeClass('ui-state-default ui-state-warning ui-state-error ui-state-confirmation ui-state-highlight')
                    .addClass(state);
                currentIcon
                    .removeClass('ui-icon-clock ui-icon-circle-check ui-icon-circle-close')
                    .addClass(icon);
            }

            function runTest(path, fileName) {
                testRunning = true;
                $('<iframe>')
                    .attr('src', 'cases/' + path + '/' + fileName)
                    .load(function() {
                        timerId = setInterval(checkStatus, 100, this.contentWindow.testResults, path, fileName);
                    })
                    .appendTo('.iframes');
            }

            function checkStatus(testResults, path, fileName) {
                if (typeof testResults !== 'undefined') {
                    if (testResults.count === testResults.tests.length) {
                        var pass = true,
                            testLength = testResults.tests.length,
                            fails = 0,
                            passes = 0;
                        for (var i = 0; i < testLength; i++) {
                            if (testResults.tests[i]['status'] !== 'pass') {
                                pass = false;
                                fails ++;
                            }
                        }
                        $($('.group[data-path="' + path + '"]').find('.item[data-file-name="' + fileName + '"]').find('.item-content').find('.items-pass-fail-ratio')).css('display','');
                        passes = testLength - fails;
                        //need to add in counter to check how many have passed and display it in the group header and the item header
                        if (pass) {
                            setItemStatus(path, fileName, 'ui-state-confirmation', 'ui-icon-circle-check', passes, testLength);

                        } else {
                            setItemStatus(path, fileName, 'ui-state-error', 'ui-icon-circle-close', passes, testLength);
                        }
                    }
                } else {
                    setItemStatus(path, fileName, 'ui-state-highlight',  'ui-icon-circle-close');
                }
                clearInterval(timerId);
                timerId = null;
                $('iframe').remove();
                testRunning = false;

            }

            var queueTimer = setInterval(function() {
                // If there is a test running, do nothing
                if (testRunning) {
                    return;
                }// Else, if there is a test in the queue, start it
                else if (queue.length !==0) {
                    runTest(queue[0].path, queue[0].fileName);
                    queue.splice(0,1);
                        }
            }, 500);

            function queueTest(path, fileName) {
                setGroupStatus(path, 'ui-state-warning', 'ui-icon-clock');
                setItemStatus(path, fileName, 'ui-state-warning', 'ui-icon-clock');
                queue.push({
                    path: path,
                    fileName: fileName
                });
            }

            $(function() {
                $('.run-test').click(function() {
                    var group = $($(this).parentsUntil($('.tests'))).last(),
                        path = group.data('path'),
                        item = $($(this).parentsUntil($('.group'))).last(),
                        fileName = item.data('fileName');
                        queueTest(path, fileName);
                });

                $('.run-group').click(function() {
                    var group = $($(this).parentsUntil($('.tests'))).last(),
                        path = group.data('path');

                        $(group).find('.item').each(function() {
                            queueTest(path, $(this).data('fileName'));
                        });
                        return false;
                });

                $('.run-all').click(function(){
                    var tests = $(this).siblings('.tests');

                        $(tests).find('.group').each(function() {
                            var path = $(this).data('path');

                            $(this).find('.item').each(function() {
                                var fileName = ($(this).data('fileName'));
                                queueTest(path, fileName);
                            });
                        });
                });

                 //make run selected tests button work
                $('.run-selected').click(function(){
                    var tests = $(this).siblings('.tests');

                    $(tests).find('.group').each(function() {
                        var groupCheckbox = $(this).find('.group-check');

                        if (groupCheckbox.is(':checked')){
                            var path = $(this).data('path');

                            $(this).find('.item').each(function() {
                                queueTest(path, $(this).data('fileName'));
                            });}
                    });
                });

                $('.group-check').change(function() {
                    if ($(this).is(':checked')) {
                        $($(this).closest('.group').find('.item-check')).attr('checked', true); // will check the checkbox with id check1
                    }else {
                        $($(this).closest('.group').find('.item-check')).attr('checked', false); // will uncheck the checkbox with id check1
                    }
                });

                $('.view-test').click(function(){
                    var path = $(this).closest('.group').data('path'),
                        filename = $(this).closest('.item').data('fileName');

                    window.open('cases/' + path + '/' + filename );
                });

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
            <button class="run-all">Run All Tests</button>
            <button class="run-selected">Run Selected Tests</button>
            This may take several minutes
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
                                <p>
                                    <span class="icon ui-icon"></span>
                                    <strong><?= $group['name'] ?></strong>
                                    <span class="group-pass-fail-ratio" style="display: none;"><span class="group-passes">0</span>/<?= sizeof($group['tests']) ?> items passed</span>
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
                    <div class="item" style="display: none;" data-file-name="<?= $item['filename'] ?>">
                        <div class="number">
                            <input class="item-check" type="checkbox"><?= $i . $j[$k] ?>
                        </div>
                        <div class="item-header">
                            <div class="ui-widget ui-notification">
                                <div class="item-content ui-state-default ui-corner-all" >
                                    <p>
                                        <span class="icon ui-icon"></span>
                                        <strong><?= $item['name'] ?></strong>
                                        <span class="items-pass-fail-ratio" style="display: none;">x/y tests passed</span>
                                        <button class="test-button run-test">Run Test</button>
                                        <button class="test-button view-test">View Test</button>
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

            <button class="run-all">Run All Tests</button>
            <button class="run-selected">Run Selected Tests</button>
            This may take several minutes
            <div class="iframes"></div>
        </div>
    </body>
</html>
