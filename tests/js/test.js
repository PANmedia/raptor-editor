if (typeof window.testResults === 'undefined') {
    window.testResults = {
        tests: [],
        finished: false
    };
}

var testQueue = [],
    testQueueTimer = null,
    testRunning = false,
    testReady = false;

function test(container, action, options) {
    if ($(container).length !== 1) {
        throw new Error('Duplicate or missing container: ' + container);
        return;
    }
    testQueue.push([container, action]);
    if (testReady === false) {
        testReady = true;
        $(function() {
            if (testQueueTimer === null) {
                testQueueTimer = setInterval(function() {
                    if (testRunning === false && testQueue.length > 0) {
                        var test = testQueue.shift();
                        runTest(test[0], test[1], test[2]);
                    }
                    if (testRunning === false && testQueue.length === 0) {
                        window.testResults.finished = true;
                        clearInterval(testQueueTimer);
                    }
                }, 20);
            }
        });
    }
}

function runTest(container, action, options) {
    var output = $(container).find('.test-output'),
        input = $(container).find('.test-input'),
        diff = $(container).find('.test-diff'),
        expected = $(container).find('.test-expected');
    var inputSource = $('<div>')
        .addClass('test-source test-box test-input-source')
        .insertAfter(input);

    applyCodeMirror(inputSource.get(0), input.html());

    input.addClass('test-box');
    $('<div>').addClass('test-clear').insertAfter(inputSource);

    var expectedSource = $('<div>')
        .addClass('test-source test-box test-expected-source')
        .insertAfter(expected);

    applyCodeMirror(expectedSource.get(0), expected.html());

    expected.addClass('test-box');
    $('<div>').addClass('test-clear').insertAfter(expectedSource);

    if (output.length === 0) {
        output = $('<div>').addClass('test-output').appendTo(container);
    }

    if (diff.length === 0) {
        diff = $('<div>').addClass('test-diff').appendTo(container);
    }

    output.html(input.html());
    var error;
    try {
        action(output);
    } catch (e) {
        console.error(e);
        console.error(e.stack);
        error = e;
    }

    output = $(container).find('.test-output');

    var outputSource = $('<div>')
        .addClass('test-source test-box test-output-source')
        .insertAfter(output);

    applyCodeMirror(outputSource.get(0), output.html());

    output.addClass('test-box');
    $('<div>').addClass('test-clear').insertAfter(outputSource);

    // if (typeof format === 'undefined' || format) {
        formatElement(expected);
        formatElement(output);
    // }

    if (error) {
        $('<pre>').text(error).appendTo(diff);
        $('<pre>').text(error.stack).appendTo(diff);
        window.testResults.tests.push({
                status: 'fail',
                type: 'error',
                error: error
            });
        fail(container);
    } else {
        sortAttributes(expected.find('*'));
        sortAttributes(output.find('*'));
        var expectedHTML = style_html(expected.html());
        var outputHTML = style_html(output.html());
        diff.html(diffstr(expectedHTML, outputHTML));
        if (expectedHTML !== outputHTML) {
            window.testResults.tests.push({
                    status: 'fail',
                    type: 'diff',
                    diff: diff,
                    expectedHTML: expectedHTML,
                    outputHTML: outputHTML
            });
            fail(container);
        } else {
            window.testResults.tests.push({
                    status: 'pass'
                });
            pass(container);
        }
    }
}
