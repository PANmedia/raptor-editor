function test(container, action, format) {
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

    if (typeof format === 'undefined' || format) {
        formatElement(expected);
        formatElement(output);
    }

    if (error) {
        $('<pre>').text(error).appendTo(diff);
        $('<pre>').text(error.stack).appendTo(diff);
        fail(container);
    } else {
        sortAttributes(expected.find('*'));
        sortAttributes(output.find('*'));
        var expectedHTML = style_html(expected.html());
        var outputHTML = style_html(output.html());
        diff.html(diffstr(expectedHTML, outputHTML));
        if (expectedHTML !== outputHTML) {
            fail(container);
        } else {
            pass(container);
        }
    }
}
