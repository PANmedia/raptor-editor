$.ui.editor.registerPlugin({
    snippet: {
        ids: [],

        init: function(editor, options) {
            if (options.snippets) {
                for (var i = 0, l = options.snippets.length; i < l; i++) {
                    this.createSnippet(options.snippets[i], editor);
                }
                this.createButtons();
                editor.bind('clean', this.removeButtons, this);
                editor.bind('restore', this.createButtons, this);
            }
        },

        createSnippet: function(snippet, editor) {
//            $.ui.editor.registerUi('snippet' + snippet.name.charAt(0).toUpperCase() + snippet.name.substr(1), {
//                init: function(editor, options) {
//                    return editor.uiButton({
//                        name: 'snippet',
//                        title: _('Insert Snippet')
//                    });
//                }
//            });
        },

        createButtons: function() {
            var editor = this.editor;

            for (var i = 0, l = this.options.snippets.length; i < l; i++) {
                var snippet = this.options.snippets[i];
                if (snippet.repeatable) {
                    this.createButton(snippet, editor);
                }
            }
        },

        createButton: function(snippet, editor) {
            var plugin = this;
            var id = editor.getUniqueId();
            this.ids.push(id);

            var button = $('<button/>')
                .addClass(plugin.options.baseClass)
                .addClass(plugin.options.baseClass + '-button')
                .addClass(plugin.options.baseClass + '-button-' + snippet.name)
                .addClass(id)
                .text('Add')
                .click(function() {
                    plugin.insertSnippet.call(plugin, snippet, editor, this);
                });

            var buttonAfter = (snippet.buttonAfter || editor.getElement());
            if ($.isFunction(buttonAfter)) {
                buttonAfter.call(this, button, snippet);
            } else {
                button.insertAfter(buttonAfter);
            }

            $('.' + id)
                .button({
                    icons: { primary: 'ui-icon-plusthick' }
                });
        },

        removeButtons: function() {
            for (var i = 0, l = this.ids.length; i < l; i++) {
                $('.' + this.ids[i]).remove();
            }
        },

        insertSnippet: function(snippet, editor, button) {
            var template = $(snippet.template).html();

            var appendTo = snippet.appendTo || editor.getElement();
            if ($.isFunction(appendTo)) {
                appendTo.call(this, template, snippet, button);
            } else {
                $(template).appendTo(appendTo);
            }

            this.removeButtons();
            editor.disableEditing();
            editor.enableEditing();
            this.createButtons();
        }

    }
});
