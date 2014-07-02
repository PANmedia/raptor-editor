/**
 * @fileOverview Contains the save JSON plugin code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * The save JSON class.
 *
 * @constructor
 * @param {String} name
 * @param {Object} overrides
 */
function SaveJsonPlugin(name, overrides) {
    this.options = {
        retain: false,
        checkDirty: true
    };
    RaptorPlugin.call(this, name || 'saveJson', overrides);
    this.size = null;
}

SaveJsonPlugin.prototype = Object.create(RaptorPlugin.prototype);

Raptor.registerPlugin(new SaveJsonPlugin());

// <strict>
SaveJsonPlugin.prototype.init = function() {
    if (typeof this.options.url !== 'string' && !$.isFunction(this.options.url)) {
        handleError('Expected save JSON URL option to be a string or a function.');
    }
    if (!$.isFunction(this.options.id)) {
        handleError('Expected save JSON id option to be a function.');
    }
    if (!typeIsString(this.options.postName)) {
        handleError('Expected save JSON postName option to be a string.');
    }
};
// </strict>

/**
 * Save Raptor content.
 */
SaveJsonPlugin.prototype.save = function(saveSections) {
    // Hack save sections
    if (typeof RaptorSection !== 'undefined' && saveSections !== false) {
        RaptorSection.save(false);
    }
    var data = {};
    this.raptor.unify(function(raptor) {
        if (this.options.checkDirty === false || raptor.isDirty()) {
            raptor.clean();
            var plugin = raptor.getPlugin('saveJson');
            var id = plugin.options.id.call(plugin);
            var html = raptor.getHtml();
            if (plugin.options.data) {
                // <strict>
                if (!$.isFunction(this.options.data)) {
                    handleError('Save JSON data option is expected to be a function.');
                }
                // </strict>
                data[id] = plugin.options.data.call(this, html);
            } else {
                data[id] = html;
            }
        }
    }.bind(this));
    var post = {};
    this.size = Object.keys(data).length;
    post[this.options.postName] = JSON.stringify(data);
    if (this.options.post) {
        // <strict>
        if (!$.isFunction(this.options.post)) {
            handleError('Save JSON post option is expected to be a function.');
        }
        // </strict>
        post = this.options.post.call(this, post);
    }
    $.ajax({
            type: this.options.type || 'post',
            dataType: this.options.dataType || 'json',
            url: this.options.url,
            data: post
        })
        .done(this.done.bind(this))
        .fail(this.fail.bind(this));
};

/**
 * Done handler.
 *
 * @param {Object} data
 * @param {Integer} status
 * @param {Object} xhr
 */
SaveJsonPlugin.prototype.done = function(data, status, xhr) {
    this.raptor.unify(function(raptor) {
        if (!raptor.getPlugin('saveJson').options.checkDirty || raptor.isDirty()) {
            raptor.saved([data, status, xhr]);
        }
    });
    var message = tr('saveJsonSaved', {
        saved: this.size
    });
    if (this.options.formatResponse) {
        // <strict>
        if (!$.isFunction(this.options.formatResponse)) {
            handleError('Save JSON formatResponse option is expected to be a function.');
        }
        // </strict>
        message = this.options.formatResponse.call(this, data, status, xhr) || message;
    }
    aNotify({
        text: message,
        type: 'success'
    });
    if (!this.options.retain) {
        this.raptor.unify(function(raptor) {
            raptor.disableEditing();
        });
    }
};

/**
 * Fail handler.
 *
 * @param {Object} xhr
 */
SaveJsonPlugin.prototype.fail = function(xhr, status, error) {
    this.raptor.fire('save-failed', [xhr.responseJSON || xhr.responseText, status, xhr]);
    var message = tr('saveJsonFail', {
        failed: this.size
    });
    if (this.options.formatResponse) {
        // <strict>
        if (!$.isFunction(this.options.formatResponse)) {
            handleError('Save JSON formatResponse option is expected to be a function.');
        }
        // </strict>
        message = this.options.formatResponse.call(this, xhr.responseJSON || xhr.responseText, status, xhr) || message;
    }
    aNotify({
        text: message,
        type: 'error'
    });
};
