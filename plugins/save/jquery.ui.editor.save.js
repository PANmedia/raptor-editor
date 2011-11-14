(function($) {
    
    $.ui.editor.addOptions({
        saveUri: '/editor/save'
    });

    $.ui.editor.addButton('save', {
        title: 'Save',
        icons: {
            primary: 'ui-icon-disk'
        },
        disabled: true,
        click: function(event, button) {
            // If the user has provided or bound their own save function, allow them to cancel the default
            if (this._trigger('save')) {

                this.message.loading.call(this, 'Saving changes...', false);

                var error = function(response_code) {
                    editor.message.error.call(editor, [
                        'Failed to save content',
                        'Response code ' + response_code + ' from ' + window.location.protocol + '//' + window.location.hostname + editor.options.saveUri
                    ], 10000);
                }, editor = this;

                $.ajax(this.options.saveUri, {
                    data: {
                        html: this.html(),
                        name: this.element.attr('name')
                    },
                    type: 'post',
                    statusCode: {
                        404: function() {
                            error(404);
                        },
                        500: function() {
                            error(500);
                        }
                    },
                    success: function(data) {
                        editor.confirm.call(editor, 'Content saved');
                        editor._data.clear.call(editor._data.names.originalHtml);
                    }
                });

            }
        },
        stateChange: function(button) {
            $(button).button('option', 'disabled', !this._content.dirty.call(this));
        }
    });
})(jQuery);
