function applyCodeMirror(node, html) {
    if (typeof CodeMirror !== 'undefined') {
        CodeMirror(node, {
            value: style_html($.trim(html)),
            mode: 'htmlmixed'
        });
    } else {
        $(node).text(html);
    }
}
