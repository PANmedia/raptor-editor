var timerID = null, // Timer to check whether to run a test or not.
    queue = [], // The test queue.
    testRunning = false;   // Boolean to show whether there is a test running.

/**
 * Sets the group header to a supplied state and updates the group's pass/fail ratio.
 *
 * @param {string} path This is the folder name of the group.
 * @param {string} state This is the state that the group should be at the end of the function.
 * @param {string} icon This is the icon the group should dislplay at the end of the function.
 * @param {number} itemsPassed This is the number of items in the group that have passed all their tests.
 */
function setGroupStatus(path, state, icon, itemsPassed) {
    var group = $('.group[data-path="' + path + '"]').find('.group-content'),
            groupIcon = group.find('.icon'),
            groupRatio = group.find('.group-pass-fail-ratio'),
            passed = groupRatio.find('.group-passes');

    $(groupRatio).css('display', '');

    passed.html(itemsPassed);

    checkState(group, groupIcon, state, icon);
}

/**
 * Sets the item header to a supplied state, supplies the state for the setGroupStatus method and updates the test pass/fail ratio.
 *
 * @param {string} path This is the folder name of the group the item belongs to.
 * @param {string} fileName This is the filename of the group
 * @param {string} state This is the state that the item should be at the end of the function.
 * @param {string} icon This is the icon the item should dislplay at the end of the function.
 * @param {number} passes This is the number of tests in the item that have passed.
 * @param {number} testLength This is the total number of tests
 */
function setItemStatus(path, fileName, state, icon, passes, testLength) {
    var item = $('.group[data-path="' + path + '"]').find('.item[data-file-name="' + fileName + '"]').find('.item-content'),
        itemIcon = item.find('.icon'),
        itemRatio = item.find('.items-pass-fail-ratio'),
        itemsPassed = 0,
        status = 'pass';

    if (typeof passes === 'undefined') {
        passes = '?';
    }
    if (typeof testLength === 'undefined') {
        testLength = '?';
    }
    itemRatio.html(passes + '/' + testLength + ' tests passed');

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

/**
 * Removes any current classes assigned to the supplied content and adds the supplied state.
 *
 * @param {jQuery} content This is the part of the html that is to have it's class changed.
 * @param {jQuery} currentIcon This is the current icon of the content which is to be replaced.
 * @param {string} state This is the class to add to the content.
 * @param {string} icon Thsi is the icon that the currentIcon should be changed to.
 */
function checkState(content, currentIcon, state, icon) {
    content
        .removeClass('ui-state-default ui-state-warning ui-state-error ui-state-confirmation ui-state-highlight')
        .addClass(state);
    currentIcon
        .removeClass('ui-icon-clock ui-icon-circle-check ui-icon-circle-close')
        .addClass(icon);
}

/**
 * Creates an iframe to run the test in, runs the test, and calls the checkStatus method.
 *
 * @param {string} path This is the folder name of the test to be run.
 * @param {string} fileName This is the file name of the test to be run.
 */
function runTest(path, fileName) {
    testRunning = true;
    $('body').addClass('tests-running');
    $('<iframe>')
            .attr('src', 'cases/' + path + '/' + fileName)
            .load(function() {
        timerId = setInterval(checkStatus, 50, this.contentWindow.testResults, path, fileName);
    })
    .appendTo('.iframes');
}

//
/**
 * Uses the supplied test results to check whether the test at the supplied path and filename has passed,
 * Updates the summary, removes the iframe, resets the timer and the test running variable.
 *
 * @param {array} testResults This is contains all the results of the tests for the specified file.
 * @param {string} path This is the folder name for the specified file.
 * @param {string} fileName This is the file name to be tested.
 */
function checkStatus(testResults, path, fileName) {
    if (typeof testResults !== 'undefined') {
        if (testResults.finished === true) {
            var itemContent = $('.group[data-path="' + path + '"]').find('.item[data-file-name="' + fileName + '"]').find('.item-content'),
                    pass = true,
                    testLength = testResults.tests.length,
                    fails = 0,
                    passes = 0;
            var errorDiv = $(itemContent).find('.error-message');

            errorDiv.text('');

            // Checks each test in the item and if it finds one fail then sets tje pass to false and adds one to the fails variable.
            for (var i = 0; i < testLength; i++) {
                if (testResults.tests[i]['status'] !== 'pass') {
                    var error = String(testResults.tests[i]['error']);
                    pass = false;
                    fails++;

                    // If there is an undefined error then use default error, otherwise append error to errors div.
                    if (testResults.tests[i]['type'] === 'diff') {
                        if (errorDiv.find(':contains(Expected output does not match actual output)').length === 0) {
                            $('<div>Expected output does not match actual output<br /></div>').appendTo(errorDiv);
                        }
                    } else if (errorDiv.find(':contains("' + error + '")').length === 0) {
                        $('<div>' + error + '</div>').appendTo(errorDiv);
                    }
                }
            }
            itemContent.find('.items-pass-fail-ratio').css('display', '');
            passes = testLength - fails;

            if (pass) {
                setItemStatus(path, fileName, 'ui-state-confirmation', 'ui-icon-circle-check', passes, testLength);
            } else {
                setItemStatus(path, fileName, 'ui-state-error', 'ui-icon-circle-close', passes, testLength);
                errorDiv.css('display', '');
            }
            finishTest();
        }
    } else {
        setItemStatus(path, fileName, 'ui-state-highlight', 'ui-icon-info'); //if the test results are undefined set the item status to highlight
        finishTest();
    }
}

function finishTest() {
    clearInterval(timerId);
    timerId = null;
    $('iframe').remove();
    updateSummary();
    testRunning = false;
    if (queue.length === 0) {
        $('body').removeClass('tests-running');
    }
}

//Checks every 500 miliseconds whether there is a test running
//If there is, wait and check again later
//If there isn't then run the next test in the queue
var queueTimer = setInterval(function() {
    if (testRunning) {
        return;
    } else if (queue.length !== 0) {
        runTest(queue[0].path, queue[0].fileName);
        queue.splice(0, 1);
    }
}, 50);

/**
 * Adds an item to the queue and updates the summary.
 *
 * @param {string} path This is the folder the test is in.
 * @param {string} fileName This is the filename of the test.
 */
function queueTest(path, fileName) {
    setGroupStatus(path, 'ui-state-warning', 'ui-icon-clock');
    setItemStatus(path, fileName, 'ui-state-warning', 'ui-icon-clock');
    queue.push({
        path: path,
        fileName: fileName
    });
    updateSummary();
}

/**
 * Creates a summary of each of the states of the tests.
 */
function updateSummary() {
    var testsFailed = $('.item .ui-state-error').length,
            testsPending = $('.item .ui-state-warning').length,
            testsPassed = $('.item .ui-state-confirmation').length,
            testsHighlighted = $('.item .ui-state-highlight').length,
            tests = $('.item').length,
            testsUntested = tests - (testsFailed + testsPassed + testsPending +testsHighlighted),
            summary = $('.content').find('.summary');

    //updates the html to reflect the results.
    summary.html(testsUntested + '/' + tests + ' test(s) are yet to be tested  '
            + testsPending + '/' + tests + ' test(s) are pending <br />'
            + testsPassed + '/' + tests + ' test(s) have passed  '
            + testsFailed + '/' + tests + ' test(s) have failed');
}

//contains all the document ready functions
$(function() {

        //Updates the summary
        updateSummary();

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
