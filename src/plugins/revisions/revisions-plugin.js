/**
 * @fileOverview Contains the revisions plugin code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * The revisions plugin class.
 *
 * @constructor
 * @augments RaptorPlugin
 *
 * Default options:
 * <pre>{
 *      url: Function|String,
 *      id: Function|String,
 *      savePlugin: String
 * }</pre>
 *
 * @param {String} name
 * @param {Object} overrides Options hash.
 */
function RevisionsPlugin(name, overrides) {
    RaptorPlugin.call(this, name || 'revisions', overrides);
}

RevisionsPlugin.prototype = Object.create(RaptorPlugin.prototype);

/**
 * Initialises the click to edit plugin.
 */
RevisionsPlugin.prototype.init = function() {
    this.raptor.addToHoverPanel(this);
    // <strict>
    if (typeof this.options.url !== 'string' && !$.isFunction(this.options.url)) {
        handleError('RevisionsPlugin expects revisions url option to be a string or function');
    }
    // </strict>
};

RevisionsPlugin.prototype.getHeaders = function() {
    if (this.options.headers) {
        return this.options.headers.call(this);
    }
    return {};
};

RevisionsPlugin.prototype.getUrl = function() {
    if (typeof this.options.url === 'string') {
        return this.options.url;
    }
    return this.options.url.call(this);
};

/**
 * Get the revisions for this instance from the server.
 * Expected data:
 * <pre>
 * {
 *  // Indicates whether each revision has an accompanying html diff showing changes
 *  // between it and the next revision in history
 *  "hasDiff": Boolean,
 *
 *  // An array of revisions
 *  "revisions": [
 *      {
 *          "identifier": String,
 *          "content": String,
 *          "updated": Integer, // Millisecond timestamp,
 *
 *          // Optional, presence indicated by hasDiff above
 *          "diff": String // The diff between this and the previous revision
 *      }
 *   ]
 * }
 * </pre>
 *
 * @param  {Function} success Function to be called with revisions & hasDiff on success
 * @param  {Function} failure Function that will display a generic error message on failure
 */
RevisionsPlugin.prototype.getRevisions = function(success, failure) {
    $.ajax({
        url: this.getUrl(),
        headers: this.getHeaders()
    }).done(function(data) {
        success(data);
    }).fail(function() {
        failure();
    });
};

/**
 * @param {RevisionsPlugin} instance
 * @return {Object}
 */
RevisionsPlugin.prototype.getButton = function(instance) {
    var button = $.extend({}, RevisionsButton);
    button.raptor = this.raptor;
    button.options = this.options;
    button.text = _('revisionsButton');
    var ui = button.init();
    return ui;
};

Raptor.registerPlugin(new RevisionsPlugin());
