function SaveRestPlugin(name, overrides) {
    this.method = 'put';
    RaptorPlugin.call(this, name || 'saveRest', overrides);
}

SaveRestPlugin.prototype = Object.create(RaptorPlugin.prototype);

SaveRestPlugin.prototype.init = function(raptor) {
    this.raptor = raptor;
    // <strict>
    if (typeof this.options.url !== 'string' && !$.isFunction(this.options.url)) {
        handleError('Expected save REST URL option to be a string or a function.');
    }
    if (!$.isFunction(this.options.data)) {
        handleError('Expected save REST data option to be a function.');
    }
    // </strict>
};

SaveRestPlugin.prototype.save = function() {
    this.requests = 0;
    this.errors = [];
    this.messages = [];
    this.raptor.unify(function(raptor) {
        if (raptor.isDirty()) {
            this.requests++;
            var xhr = raptor.getPlugin('saveRest').sendRequest();
            xhr.raptor = raptor;
            xhr
                .done(this.done.bind(this))
                .fail(this.fail.bind(this))
                .always(this.always.bind(this));
        }
    }.bind(this));
};

SaveRestPlugin.prototype.done = function(data, status, xhr) {
    xhr.raptor.saved();
    this.messages.push(data);
};

SaveRestPlugin.prototype.fail = function(xhr) {
    this.errors.push(xhr.responseText);
};

SaveRestPlugin.prototype.always = function() {
    this.requests--;
    if (this.requests === 0) {
        if (this.errors.length > 0 && this.messages.length === 0) {
            this.raptor.showError(_('saveRestFail', {
                failed: this.errors.length
            }));
        } else if (this.errors.length > 0) {
            this.raptor.showError(_('saveRestPartial', {
                saved: this.messages.length,
                failed: this.errors.length
            }));
        } else {
            this.raptor.showConfirm(_('saveRestSaved', {
                saved: this.messages.length
            }), {
                delay: 1000,
                hide: function() {
                    this.editor.unify(function(editor) {
                        editor.disableEditing();
                        editor.hideLayout();
                    });
                }
            });
        }
    }
};

SaveRestPlugin.prototype.sendRequest = function() {
    var data = this.raptor.getPlugin('saveRest').getData(),
        url = this.raptor.getPlugin('saveRest').getURL();
    return $.ajax({
        type: this.options.type || 'post',
        dataType: this.options.type || 'json',
        data: data,
        url: url
    });
};

SaveRestPlugin.prototype.getData = function() {
    // Get the data to send to the server
    var content = this.raptor.getHtml();
    return this.options.data.call(this, content);
};

SaveRestPlugin.prototype.getURL = function() {
    if (typeof this.options.url === 'string') {
        return this.options.url;
    }
    return this.options.url.call(this);
};

Raptor.registerPlugin(new SaveRestPlugin());
