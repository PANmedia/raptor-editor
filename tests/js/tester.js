function runTest(name) {
    $('.test-template').each(function() {
        var node = this;
        $.get('cases/' + name + '/test.js').done(function(js) {
            var original = node.innerHTML,
                text = $(node).text(),
                start = text.indexOf('{'),
                end = text.indexOf('}') - 1,
                expected = $('<div/>').addClass('test-expected'),
                after = null,
                input = null,
                output = null,
                diff = null,
                wrapper = null;
            input = node.innerHTML.replace('{', '').replace('}', '');
            $.ui.editor.instances[0].setHtml(input);
            setSelectionRange($.ui.editor.instances[0].element.get(0), start, end);
            eval(js);
            after = $.ui.editor.instances[0].getHtml();
            $('.test-results').append(wrapper = $('<div/>').addClass('test-wrapper'));
            wrapper.append($('<h2/>').html(name + ' ' + $(node).data('name')));
            wrapper.append(input = $('<div/>').addClass('test-input').html(original));
            wrapper.append(output = $('<div/>').addClass('test-output').html(node.innerHTML));
            wrapper.append(diff = $('<div/>').addClass('test-diff'));
            wrapper.append(expected);
            $.get('cases/' + name + '/output/' + $(node).data('name') + '.html').done(function(content) {
                content = $(content).wrap('<div/>').parent().find('.test-template').html();
                expected.html(content);
                diff.html(diffstr(content, after));
                if (after == content) {
                    wrapper.addClass('pass');
                } else {
                    wrapper.addClass('fail');
                }
            });
            node.innerHTML = original;
        });
    });
}
$(function() {
    $('.dummy-editor').editor({
        autoEnable: true,
        urlPrefix: '/jquery-raptor.com/private/jquery-raptor/src/'
    });
    runTest('toggle-wrapper-1');
    runTest('color-picker');
});
