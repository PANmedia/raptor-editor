function testEditor(container, action, format) {
    var input = $(container).find('.test-input');
    var html = input.html();
    var output = $('<div>').addClass('test-output').html(html).appendTo(container);
    var diff = $('<div>').addClass('test-diff').appendTo(container);
    var expected = $(container).find('.test-expected .editible');
    output.find('.editible').raptor({
        autoEnable: true,
        urlPrefix: '../../../src/'
    });
    
    input.addClass('test-box');
    $('<div>').addClass('test-clear').insertAfter(input);
    $(container).find('.test-expected').addClass('test-box');
    $('<div>').addClass('test-clear').insertAfter($(container).find('.test-expected'));
    output.addClass('test-box');
    $('<div>').addClass('test-clear').insertAfter(output);
    
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
            var expHTML = style_html(expected.html());
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

       
            