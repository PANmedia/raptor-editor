$.ui.editor.registerPlugin('save', {
    
    options: {
        ajax: {
            url: '/',
            type: 'post',
            cache: false
        },
        id: { attr: 'name' },
        postName: 'content'
    },
    
    init: function() {
    },
    
    getId: function() {
        if (typeof(this.options.id) === 'string') {
            return this.options.id;
        } else if (this.options.id.attr) {
            return this.editor.getOrignalElement().attr(this.options.id.attr);
        }
        return null;
    },
    
    getData: function() {
        var data = {};
        data[this.getId()] = this.editor.getHtml();
        return data;
    },
    
    save: function() {
        var message = this.editor.showLoading(_('Saving changes...'));
        
        // Get all unified content 
        var contentData = {};
        this.editor.unify(function(editor) {
            var plugin = editor.getPlugin('save');
            $.extend(contentData, plugin.getData());
        });
        
        // Create POST data
        var data = {};
        
        // Content is serialized to a JSON object, and sent as 1 post parameter
        data[this.options.postName] = JSON.stringify(contentData);
        
        // Create the JSON request
        var ajax = $.extend({}, this.options.ajax, {
            data: data,
            context: this
        });
        
        // Send the data to the server
        $.ajax(ajax).done(function() {
            this.editor.showConfirm(_('Successfully saved content.'), {
                delay: 1000,
                hide: function() {
                    this.editor.disableEditing();
                    this.editor.hideToolbar();
                }
            });
        }).fail(function() {
            this.editor.showError(_('Failed to save content.'));
        }).always(function() {
            message.hide();
        });
    }
    
});

$.ui.editor.registerUi({
    save: {
        init: function(editor, element) {
            return editor.uiButton({
                title: _('Save'),
                icon: 'ui-icon-disk',
                click: function() {
                    editor.getPlugin('save').save();
                }
            });
        }
    }
});

////$.ui.editor.registerUi({
//    save: function(editor, options) {
//        options = $.extend({
//            saveUri: '/editor/save'
//        }, options);
//        var ui = this.ui = editor.uiButton({
//            title: _('Save'),
//            icon: 'ui-icon-disk',
//            disabled: true,
//            click: function() {
//                // If the user has provided or bound their own save function, allow them to cancel the default
//                if (this._trigger('save')) {
//
//                    this.message.loading.call(this, _('Saving changes...'), false);
//
//                    var error = function(response_code) {
//                        editor.message.error.call(editor, [
//                            _('Failed to save content'),
//                            _('Response code {{responseCode}} from {{location}}', { responseCode: response_code, location: window.location.protocol + '//' + window.location.hostname + editor.options.saveUri })
//                        ], 10000);
//                    }, editor = this;
//
//                    $.ajax(saveUri, {
//                        data: {
//                            html: this.html(),
//                            name: editor.target.attr('name')
//                        },
//                        type: 'post',
//                        statusCode: {
//                            404: function() {
//                                error(404);
//                            },
//                            500: function() {
//                                error(500);
//                            }
//                        },
//                        success: function(data) {
//                            editor.confirm.call(editor, _('Content saved'));
//                            editor._data.clear.call(editor._data.names.originalHtml);
//                        }
//                    });
//
//                }
//            }
//        });
//        editor.bind('change', function() {
//            if (!editor.isDirty()) ui.disable();
//            else ui.enable();
//        });
//    }
//});
