$.ui.editor.registerPlugin({
    snippet: {
        init: function(editor, options) {
            if (options.snippets) {
                for (var i = 0, l = options.snippets.length; i < l; i++) {
                    var snippet = options.snippets[i];
                    $.ui.editor.registerUi('snippet' + snippet.name.charAt(0).toUpperCase() + snippet.name.substr(1), {
                        init: function(editor, options) {
                            return editor.uiButton({
                                name: 'snippet',
                                title: _('Insert Snippet')
                            });
                        }
                    });
                }
            }
        }
    }
});
