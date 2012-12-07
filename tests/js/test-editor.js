function testEditor(container, action, format) {
    var input = $(container).find('.test-input');
    var html = input.html();
    var output = $('<div>').addClass('test-output').html(html).appendTo(container);
    var diff = $('<div>').addClass('test-diff').appendTo(container);
    var expected = $(container).find('.test-expected');
    output.find('.editible').raptor({
        autoEnable: true,
        urlPrefix: '../../../src/'
    });

    var inputSource = $('<div>')
        .addClass('test-source test-box test-input-source')
        .insertAfter(input);
    applyCodeMirror(inputSource.get(0), input.find('.editible').html());
    input.addClass('test-box');
    $('<div>').addClass('test-clear').insertAfter(inputSource);

    var expectedSource = $('<div>')
        .addClass('test-source test-box test-expected-source')
        .insertAfter(expected);
    applyCodeMirror(expectedSource.get(0), expected.find('.editible').html());
    expected.addClass('test-box');
    $('<div>').addClass('test-clear').insertAfter(expectedSource);

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

        output = $(container).find('.test-output');
        var outputSource = $('<div>')
            .addClass('test-source test-box test-output-source')
            .insertAfter(output);
        applyCodeMirror(outputSource.get(0), output.find('.editible').html());
        output.addClass('test-box');
        $('<div>').addClass('test-clear').insertAfter(outputSource);

        if (error) {
            $('<pre>').text(error).appendTo(diff);
            $('<pre>').text(error.stack).appendTo(diff);
            fail(container);
        } else {
            var expHTML = style_html(expected.find('.editible').html());
            var outHTML = style_html(output.find('.editible').html());

            diff.html(diffstr(expHTML, outHTML));
            if (outHTML !== expHTML) {
                fail(container);
            } else {
                pass(container);
            }
        }
    }, 100);

}


