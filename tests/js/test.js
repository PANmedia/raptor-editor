function test(container, action, format) {
    var output = $(container).find('.test-output'),
        input = $(container).find('.test-input'),
        diff = $(container).find('.test-diff'),
        expected = $(container).find('.test-expected');

    if (output.length === 0) {
        output = $('<div>').addClass('test-output').appendTo(container);
    }

    if (diff.length === 0) {
        diff = $('<div>').addClass('test-diff').appendTo(container);
    }

    output.html(input.html());
    action(output);

    if (typeof format === 'undefined' || format) {
        formatElement(expected);
        formatElement(output);
    }

    diff.html(diffstr(expected.html(), output.html()));

    if (output.html() === expected.html()) {
        pass(container);
    } else {
        fail(container);
    }
}
