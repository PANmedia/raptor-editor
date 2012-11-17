function test(container, action) {
    var output = $(container).find('.test-output'),
        input = $(container).find('.test-input'),
        diff = $(container).find('.test-diff'),
        expected = $(container).find('.test-expected');

    output.html(input.html());
    action(output);

    diff.html(diffstr(expected.html(), output.html()));

    if (output.html() === expected.html()) {
        pass(container);
    } else {
        fail(container);
    }
}
