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
    var error;
    try {
        action(output);
    } catch (e) {
        console.error(e);
        console.error(e.stack);
        error = e;
    }
    
    output = $(container).find('.test-output');

    if (typeof format === 'undefined' || format) {
        formatElement(expected);
        formatElement(output);
    }

    if (error) {
        $('<pre>').text(error).appendTo(diff);
        $('<pre>').text(error.stack).appendTo(diff);
        fail(container);
    } else {
        diff.html(diffstr(expected.html(), output.html()));
        if (output.html() !== expected.html()) {
            fail(container);
        } else {
            pass(container);
        }
    }
}
