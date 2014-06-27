/**
 * @fileOverview Contains the save rest class code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * The save rest class.
 *
 * @constructor
 * @augments RaptorPlugin
 *
 * @param {String} name
 * @param {Object} overrides Options hash
 */
function SaveRestPlugin(name, overrides) {
    this.method = 'put';
    this.options = {
        retain: false,
        checkDirty: true
    };
    RaptorPlugin.call(this, name || 'saveRest', overrides);
}

SaveRestPlugin.prototype = Object.create(RaptorPlugin.prototype);

/**
 * Initializes the save rest plugin.
 *
 * @returns {Element}
 */
// <strict>
SaveRestPlugin.prototype.init = function() {
    if (typeof this.options.url !== 'string' && !$.isFunction(this.options.url)) {
        debug('Expected save REST URL option to be a string or a function.');
    }
    if (!$.isFunction(this.options.data)) {
        debug('Expected save REST data option to be a function.');
    }
};
// </strict>

/**
 * Saves the selection.
 */
SaveRestPlugin.prototype.save = function() {
    this.requests = 0;
    this.errors = [];
    this.messages = [];
    this.raptor.unify(function(raptor) {
        if (this.options.checkDirty === false || raptor.isDirty()) {
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

/**
 * @param {type} data
 * @param {type} status
 * @param {type} xhr
 */
SaveRestPlugin.prototype.done = function(data, status, xhr) {
    xhr.raptor.saved();
    this.messages.push(data);
};

/**
 * @param {type} xhr
 */
SaveRestPlugin.prototype.fail = function(xhr) {
    this.errors.push(xhr.responseText);
};

/**
 * Action always peformed on AJAX request
 */
SaveRestPlugin.prototype.always = function() {
    this.requests--;
    if (this.requests === 0) {
        if (this.errors.length > 0 && this.messages.length === 0) {
            aNotify({
                text: tr('saveRestFail', {
                    failed: this.errors.length
                }),
                type: 'error'
            });
        } else if (this.errors.length > 0) {
            aNotify({
                text: tr('saveRestPartial', {
                    saved: this.messages.length,
                    failed: this.errors.length
                }),
                type: 'error'
            });
        } else {
            aNotify({
                text: tr('saveRestSaved', {
                    saved: this.messages.length
                }),
                type: 'success'
            });
            if (!this.options.retain) {
                this.raptor.unify(function(raptor) {
                    raptor.disableEditing();
                });
            }
        }
    }
};

/**
 * @returns {Object} AJAX promise object
 */
SaveRestPlugin.prototype.sendRequest = function() {
    var headers = this.raptor.getPlugin('saveRest').getHeaders(),
        data = this.raptor.getPlugin('saveRest').getData(),
        url = this.raptor.getPlugin('saveRest').getURL();
    return $.ajax({
        type: this.options.type || 'post',
        dataType: this.options.dataType || 'json',
        headers: headers,
        data: data,
        url: url
    });
};

/**
 * @returns {SaveRestPlugin.prototype.getHeaders}
 */
SaveRestPlugin.prototype.getHeaders = function() {
    if (this.options.headers) {
        return this.options.headers.call(this);
    }
    return {};
};

/**
 * @returns {SaveRestPlugin.prototype.getData.data}
 */
SaveRestPlugin.prototype.getData = function() {
    // Get the data to send to the server
    this.raptor.clean();
    var content = this.raptor.getHtml(),
        data = this.options.data.call(this, content);
    data._method = this.method;
    return data;
};

/**
 * @returns {String} The URL to use for REST calls
 */
SaveRestPlugin.prototype.getURL = function() {
    if (typeof this.options.url === 'string') {
        return this.options.url;
    }
    return this.options.url.call(this);
};

Raptor.registerPlugin(new SaveRestPlugin());
