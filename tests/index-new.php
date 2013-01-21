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
            var timerID = null,
                queue = [],
                testRunning = false;

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
                    itemRatio = item.find('.items-pass-fail-ratio'),
                    itemsPassed = 0,
                    status = 'pass';

                itemRatio.html( passes + '/' + testLength + ' tests passed');

                checkState(item, itemIcon, state, icon);

                item.closest('.group').find('.item-content').each(function() {
                    if ($(this).hasClass('ui-state-warning')) {
                        status = 'loading';
                        return false;
                    } else if ($(this).hasClass('ui-state-error')) {
                        status = 'fail';
                    } else if ($(this).hasClass('ui-state-highlight') && status === 'pass') {
                        status = 'highlight';
                    } else if ($(this).hasClass('ui-state-confirmation')) {
                        itemsPassed++;
                    }
                });

                if (status === 'pass') {
                    setGroupStatus(path, 'ui-state-confirmation', 'ui-icon-circle-check', itemsPassed);
                } else if (status === 'fail') {
                    setGroupStatus(path, 'ui-state-error', 'ui-icon-circle-close', itemsPassed);
                } else if (status === 'loading') {
                    setGroupStatus(path, 'ui-state-warning', 'ui-icon-clock', itemsPassed);
                } else if (status === 'highlight') {
                    setGroupStatus(path, 'ui-state-highlight', 'ui-icon-info');
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
                        var itemContent = $('.group[data-path="' + path + '"]').find('.item[data-file-name="' + fileName + '"]').find('.item-content'),
                            pass = true,
                            testLength = testResults.tests.length,
                            fails = 0,
                            passes = 0;
                        var errorDiv = $(itemContent).find('.error-message');

                        errorDiv.text('');

                        for (var i = 0; i < testLength; i++) {
                            if (testResults.tests[i]['status'] !== 'pass') {
                                var error = String(testResults.tests[i]['error']);
                                pass = false;
                                fails ++;

                                if (error === 'undefined' ) {
                                    $('<div>Expected output does not match actual output<br /></div>').appendTo(errorDiv);
                                } else {
                                    $('<div>' + error +'</div>').appendTo(errorDiv);
                                }
                            }
                        }
                        itemContent.find('.items-pass-fail-ratio').css('display','');
                        passes = testLength - fails;

                        if (pass) {
                            setItemStatus(path, fileName, 'ui-state-confirmation', 'ui-icon-circle-check', passes, testLength);
                        } else {
                            setItemStatus(path, fileName, 'ui-state-error', 'ui-icon-circle-close', passes, testLength);
                            errorDiv.css('display','');
                        }
                    }
                } else {
                    setItemStatus(path, fileName, 'ui-state-highlight',  'ui-icon-info');
                }
                clearInterval(timerId);
                timerId = null;
                $('iframe').remove();
                getSummary();
                testRunning = false;
            }

            var queueTimer = setInterval(function() {
                if (testRunning) {
                    return;
                } else if (queue.length !==0) {
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
                getSummary();
            }

            function getSummary(){
                var testsFailed = $('.item .ui-state-error').length,
                    testsPending = $('.item .ui-state-warning').length,
                    testsPassed = $('.item .ui-state-confirmation').length,
                    tests = $('.item').length,
                    testsUntested = tests - (testsFailed + testsPassed + testsPending),
                    summary = $('.content').find('.summary');

                summary.html(testsUntested + '/' + tests +' test(s) are yet to be tested  '
                    + testsPending + '/' + tests +' test(s) are pending <br />'
                    + testsPassed +'/' + tests +' test(s) have passed  '
                    + testsFailed +'/' + tests +' test(s) have failed');
            }

            $(function() {

                getSummary();

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

                $('.run-all').click(function() {
                    var content = $(this).parents('.content');

                        $(content).find('.group').each(function() {
                            var path = $(this).data('path');

                            $(this).find('.item').each(function() {
                                queueTest(path, $(this).data('fileName'));
                            });
                        });
                });


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

                $('.group-check').change(function() {
                    if ($(this).is(':checked')) {
                        $($(this).closest('.group').find('.item-check')).attr('checked', true);
                    } else {
                        $($(this).closest('.group').find('.item-check')).attr('checked', false);
                    }
                });

                $('.view-test').click(function() {
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
            $warnings = [];
            $groups = [];
            $group_csv_data = [];
            $csv_data = [];


            $csv_total_file_content = file_get_contents('tests.csv');
            $total_lines = explode("\n", $csv_total_file_content);
            $total_head = str_getcsv(array_shift($total_lines));

            foreach ($total_lines as $total_line) {
                $total_row_data = array_combine($total_head, str_getcsv($total_line));
                if (trim($total_row_data['File Name']) === '') {
                    $group_csv_data[$total_row_data['Folder']] = $total_row_data;
                } else {
                    $csv_data[$total_row_data['Folder'] . '/' . $total_row_data['File Name']] = $total_row_data;
                }
            }

            $findTests = function($case) use($csv_data, &$warnings) {
                $tests = [];
                foreach (glob($case . '/*.*') as $file) {
                    $index = basename($case) . '/' . basename($file);
                    if (!isset($csv_data[$index]["Description"])) {
                        $warnings[] = 'No description found for: ' . $index;
                        continue;
                    }
                    $tests[] = [
                        'name' => $csv_data[$index]['Name'],
                        'filename' => basename($file),
                        'description' => $csv_data[$index]['Description'],
                    ];
                }
                return $tests;
            };

            foreach (glob(__DIR__ . '/cases/*') as $case) {
                $index = basename($case);
                    if (!isset($group_csv_data[$index]['Description'])) {
                        $warnings[] = 'No description found for: ' . $index;
                        continue;
                    }
                    $groups[] = [
                    'name' => $group_csv_data[$index]['Name'],
                    'path' => basename($case),
                    'description' => $group_csv_data[$index]['Description'],
                    'tests' => $findTests($case),
                ];
            }
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
                                <button class="test-button run-group">Run Group Test</button>
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
