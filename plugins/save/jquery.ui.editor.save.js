$.ui.editor.addButton('save', function(editor) {
    console.info('FIXME: save URI needs customizing');
    var saveUri = '/editor/save';
    
    this.title = _('Save');
    this.icons = {
        primary: 'ui-icon-disk'
    };
    this.disabled = true;
    this.click = function() {
        // If the user has provided or bound their own save function, allow them to cancel the default
        if (this._trigger('save')) {

            this.message.loading.call(this, _('Saving changes...'), false);

            var error = function(response_code) {
                editor.message.error.call(editor, [
                    _('Failed to save content'),
                    _('Response code <*responseCode*> from <*location*>', { responseCode: response_code, location: window.location.protocol + '//' + window.location.hostname + editor.options.saveUri })
                ], 10000);
            }, editor = this;

            $.ajax(saveUri, {
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
                    editor.confirm.call(editor, _('Content saved'));
                    editor._data.clear.call(editor._data.names.originalHtml);
                }
            });

        }
    }
    console.info('FIXME: check state change gets fired');
    this.change = function(button) {
        $(button).button('option', 'disabled', !this._content.dirty.call(this));
    }
});
