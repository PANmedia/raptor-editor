$.ui.editor.registerPlugin({
    snipet: {
        init: function(editor, options) {
            for (var i = 0, l = options.snipets.length; i < l; i++) {
                var snipet = options.snipets[i];
                $.ui.editor.registerUi('snipet' + snipet.name.charAt(0).toUpperCase() + snipet.name.substr(1), {
                    init: function(editor, options) {
                        return editor.uiButton({
                            name: 'snipet',
                            title: _('Insert Snipet')
                        });
                    }
                });
            }
        }
    }
});
