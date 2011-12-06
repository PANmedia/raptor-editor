$.ui.editor.registerPlugin('save', {
    
    options: {
        id: { attr: 'name' },
        postName: 'content',
        showResponse: false,
        appendId: false,
        ajax: {
            url: '/',
            type: 'post',
            cache: false
        }
    },
    
    init: function() {
    },
    
    getId: function() {
        if (typeof(this.options.id) === 'string') {
            return this.options.id;
        } else if (this.options.id.attr) {
            return this.editor.getOriginalElement().attr(this.options.id.attr);
        }
        return null;
    },
    
    getData: function() {
        var data = {};
        data[this.getId()] = this.editor.getHtml();
        return data;
    },
    
    save: function() {
        this.message = this.editor.showLoading(_('Saving changes...'));
        
        // Get all unified content 
        var contentData = {};
        var dirty = 0;
        this.editor.unify(function(editor) {
            if (editor.isDirty()) {
                dirty++;
                var plugin = editor.getPlugin('save');
                $.extend(contentData, plugin.getData());
                editor.save();
            }
        });
        this.dirty = dirty;
        
        // Count the number of requests 
        this.saved = 0;
        this.failed = 0;
        this.requests = 0;
        
        // Check if we are passing the content data in multiple requests (rest)
        if (this.options.multiple) {
            // Pass each content block individually
            for (var id in contentData) {
                this.ajax(contentData[id], id);
            }
        } else {
            // Pass all content at once
            this.ajax(contentData);
        }
    },
    
    done: function(data) {
        if (this.options.multiple) {
            this.saved++;
        } else {
            this.saved = this.dirty;
        }
        if (this.options.showResponse) {
            this.editor.showConfirm(data, {
                delay: 1000,
                hide: function() {
                    this.editor.unify(function(editor) {
                        editor.disableEditing();
                        editor.hideToolbar();
                    });
                }
            });
        }
    },
    
    fail: function(data) {
        if (this.options.multiple) {
            this.failed++;
        } else {
            this.failed = this.dirty;
        }
        if (this.options.showResponse) {
            this.editor.showError(data);
        }
    },
    
    always: function() {
        if (this.dirty === this.saved + this.failed) {
            if (!this.options.showResponse) {
                if (this.failed > 0 && this.saved === 0) {
                    this.editor.showError(_('Failed to save {{failed}} content block(s).', this));
                } else if (this.failed > 0) {
                    this.editor.showError(_('Saved {{saved}} out of {{dirty}} content blocks.', this));
                } else {
                    this.editor.showConfirm(_('Successfully saved {{saved}} content block(s).', this), {
                        delay: 1000,
                        hide: function() {
                            this.editor.unify(function(editor) {
                                editor.disableEditing();
                                editor.hideToolbar();
                            });
                        }
                    });
                }
            }
        
            // Hide the loading message
            this.message.hide();
            this.message = null;
        }
    },
    
    ajax: function(contentData, id) {
        // Create POST data
        var data = {};
        
        // Content is serialized to a JSON object, and sent as 1 post parameter
        data[this.options.postName] = JSON.stringify(contentData);
        
        // Create the JSON request
        var ajax = $.extend(true, {}, this.options.ajax, {
            data: data
        });
        
        // Get the URL, if it is a callback
        if ($.isFunction(ajax.url)) {
            ajax.url = ajax.url.apply(this, [id]);
        }
        
        // Send the data to the server
        this.requests++;
        $.ajax(ajax)
            .done($.proxy(this.done, this))
            .fail($.proxy(this.fail, this))
            .always($.proxy(this.always, this));
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
