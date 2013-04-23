$(function() {
    if ($('.test-editor-spacer').length === 0) {
        $('<div>').addClass('test-editor-spacer').height(50).prependTo('body');
    }
});

if (typeof window.testResults === 'undefined') {
    window.testResults = {
        tests: [],
        finished: false
    };
}

var testEditorQueue = [],
    testEditorQueueTimer = null,
    testEditorRunning = false;

function testEditor(container, action, options) {
    if ($(container).length !== 1) {
        throw new Error('Duplicate or missing container: ' + container);
    }
    testEditorQueue.push([container, action, options]);
    if (testEditorQueueTimer === null) {
        testEditorQueueTimer = setInterval(function() {
            if (testEditorRunning === false && testEditorQueue.length > 0) {
                var test = testEditorQueue.shift();
                runEditorTest(test[0], test[1], test[2]);
            }
            if (testEditorRunning === false && testEditorQueue.length === 0) {
                window.testResults.finished = true;
                clearInterval(testEditorQueueTimer);
            }
        }, 20);
    }
}

var defaultOptions = {
    autoEnable: true,
    urlPrefix: '../../../src/',
    unloadWarning: false,
    plugins: {
        dock: {
            docked: true,
            persist: false
        },
        logo: false,
        save: {
            plugin: null
        },
        saveJson: {
            url: 'save.php',
            postName: 'raptor-content',
            id: function() {
                return this.raptor.getElement().data('id');
            }
        },
        saveRest: {
            url: 'save.php',
            data: function(html) {
                return {
                    id: this.raptor.getElement().data('id'),
                    content: html
                };
            }
        },
        classMenu: {
            classes: {
                'Blue background': 'cms-blue-bg',
                'Round corners': 'cms-round-corners',
                'Indent and center': 'cms-indent-center'
            }
        }
    }
};

function runEditorTest(container, action, options) {
    testEditorRunning = true;
    var input = $(container).find('.test-input');
    var html = input.html();
    var output = $('<div>').addClass('test-output').html(html).appendTo(container);
    var diff = $('<div>').addClass('test-diff').appendTo(container);
    var expected = $(container).find('.test-expected');
    options = $.extend({}, defaultOptions, options, true);
    output.find('.editable').raptor(options);

    var inputSource = $('<div>')
        .addClass('test-source test-box test-input-source')
        .insertAfter(input);
    applyCodeMirror(inputSource.get(0), input.find('.editable').html());
    input.addClass('test-box');
    $('<div>').addClass('test-clear').insertAfter(inputSource);

    var expectedSource = $('<div>')
        .addClass('test-source test-box test-expected-source')
        .insertAfter(expected);
    applyCodeMirror(expectedSource.get(0), expected.find('.editable').html());
    expected.addClass('test-box');
    $('<div>').addClass('test-clear').insertAfter(expectedSource);

    setTimeout(function() {
        var ranges = tokensToRanges(output.find('.editable'));
        rangy.getSelection().setRanges(ranges);

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
        applyCodeMirror(outputSource.get(0), output.find('.editable').html());
        output.addClass('test-box');
        $('<div>').addClass('test-clear').insertAfter(outputSource);

        var expectedHTML, actualHTML;
        if (error) {
            expectedHTML = style_html(expected.find('.editable').html());
            actualHTML = style_html(output.find('.editable').html());
            if (actualHTML !== expectedHTML) {
                diff.html(diffstr(expectedHTML, actualHTML));
            }
            $('<pre class="error-output">').text(error).appendTo(diff);
            $('<pre class="error-output">').text(error.stack).appendTo(diff);
            window.testResults.tests.push({
                status: 'fail',
                type: 'error',
                error: error
            });
            fail(container);
        } else {
            expectedHTML = style_html(expected.find('.editable').html());
            actualHTML = style_html(output.find('.editable').html());

            diff.html(diffstr(expectedHTML, actualHTML));
            if (actualHTML !== expectedHTML) {
                var expectedHTMLNoBraces = style_html(expected.find('.editable').html().replace(/[{}]/g, ''));
                var actualHTMLNoBraces = style_html(output.find('.editable').html().replace(/[{}]/g, ''));
                if (actualHTMLNoBraces === expectedHTMLNoBraces) {
                    diff.prepend(diffstr(expectedHTMLNoBraces, actualHTMLNoBraces));
                    diff.prepend('<h1>Possible selection restore issue.</h1>');
                }

                window.testResults.tests.push({
                    status: 'fail',
                    type: 'diff',
                    diff: diff,
                    expectedHTML: expectedHTML,
                    actualHTML: actualHTML,
                    error: new Error('test')
                });
                fail(container);
            } else {
                window.testResults.tests.push({
                    status: 'pass'
                });
                pass(container);
            }
        }
        testEditorRunning = false;
    }, 50);
}

function getRaptor(input) {
    return input.find('.editable').data('uiRaptor');
}

function getLayoutElement(input) {
    return getRaptor(input).getLayout('toolbar').getElement();
}

function clickButton(input, button) {
    return getLayoutElement(input).find(button).trigger('click');
}
