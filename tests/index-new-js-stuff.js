var timerID = null, //Timer to check whether to run a test or not
    queue = [], //The test queue
    testRunning = false;   //Boolean to show whether there is a test running

//Sets the group header to a supplied state and updates the group's pass/fail ratio
function setGroupStatus(path, state, icon, itemsPassed) {
    var group = $('.group[data-path="' + path + '"]').find('.group-content'),
            groupIcon = group.find('.icon'),
            groupRatio = group.find('.group-pass-fail-ratio'),
            passed = groupRatio.find('.group-passes');

    $(groupRatio).css('display', '');

    passed.html(itemsPassed);

    checkState(group, groupIcon, state, icon);
}

//Sets the item header to a supplied state, supplies the state for the setGroupStatus method and updates the test pass/fail ratio
function setItemStatus(path, fileName, state, icon, passes, testLength) {
    var item = $('.group[data-path="' + path + '"]').find('.item[data-file-name="' + fileName + '"]').find('.item-content'),
            itemIcon = item.find('.icon'),
            itemRatio = item.find('.items-pass-fail-ratio'),
            itemsPassed = 0,
            status = 'pass';

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

//Removes any current classes assigned to the supplied content and adds the supplied state
function checkState(content, currentIcon, state, icon) {
    content
        .removeClass('ui-state-default ui-state-warning ui-state-error ui-state-confirmation ui-state-highlight')
        .addClass(state);
    currentIcon
        .removeClass('ui-icon-clock ui-icon-circle-check ui-icon-circle-close')
        .addClass(icon);
}

//Creates an iframe to run the test in, runs the test, and calls the checkStatus method
function runTest(path, fileName) {
    testRunning = true;
    $('<iframe>')
            .attr('src', 'cases/' + path + '/' + fileName)
            .load(function() {
        timerId = setInterval(checkStatus, 100, this.contentWindow.testResults, path, fileName);
    })
    .appendTo('.iframes');
}

//Uses the supplied test results to check whether the test at the supplied path and filename has passed
//Updates the summary, removes the iframe, resets the timer and the test running variable
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
                    fails++;

                    if (error === 'undefined') {
                        $('<div>Expected output does not match actual output<br /></div>').appendTo(errorDiv);
                    } else {
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
        }
    } else {
        setItemStatus(path, fileName, 'ui-state-highlight', 'ui-icon-info');
    }
    clearInterval(timerId);
    timerId = null;
    $('iframe').remove();
    getSummary();
    testRunning = false;
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
}, 500);

//Adds an item to the queue and updates the summary
function queueTest(path, fileName) {
    setGroupStatus(path, 'ui-state-warning', 'ui-icon-clock');
    setItemStatus(path, fileName, 'ui-state-warning', 'ui-icon-clock');
    queue.push({
        path: path,
        fileName: fileName
    });
    getSummary();
}

//Creates a summary of each of the states of the tests
function getSummary() {
    var testsFailed = $('.item .ui-state-error').length,
            testsPending = $('.item .ui-state-warning').length,
            testsPassed = $('.item .ui-state-confirmation').length,
            testsHighlighted = $('.item .ui-state-highlight').length,
            tests = $('.item').length,
            testsUntested = tests - (testsFailed + testsPassed + testsPending +testsHighlighted),
            summary = $('.content').find('.summary');

    summary.html(testsUntested + '/' + tests + ' test(s) are yet to be tested  '
            + testsPending + '/' + tests + ' test(s) are pending <br />'
            + testsPassed + '/' + tests + ' test(s) have passed  '
            + testsFailed + '/' + tests + ' test(s) have failed');
}
