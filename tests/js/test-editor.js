function testEditor(container, action, format) {
    var html = $(container).find('.test-input').html();
    var output = $('<div>').addClass('test-output').html(html).appendTo(container);
    var diff = $('<div>').addClass('test-diff').appendTo(container);
    var expected = $('.test-expected .editible');
    output.find('.editible').raptor({
        autoEnable: true,
        urlPrefix: '../../../src/'
    });
    setTimeout(function() {
        var ranges = tokensToRanges(output.find('.editible'));
        rangy.getSelection().setRanges(ranges);

        var error;
        try {
            action(output);
        } catch (e) {
            console.error(e);
            console.error(e.stack);
            error = e;
        }

        if (error) {
            $('<pre>').text(error).appendTo(diff);
            $('<pre>').text(error.stack).appendTo(diff);
            fail(container);
        } else {
            diff.html(diffstr(expected.html(), output.find('.editible').html()));
            if (output.find('.editible').html() !== expected.html()) {
                fail(container);
            } else {
                pass(container);
            }
        }
    }, 100);

}


