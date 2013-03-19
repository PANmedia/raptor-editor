/**
 * @fileOverview Contains the revisions plugin code.
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * @class The revisions plugin class.
 * @constructor
 * @augments Raptor Plugin.
 *
 * @param {type} name
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
    if (typeof this.options.url !== 'string') {
        handleError('RevisionsPlugin expects revisions url option to be set');
    }
    // </strict>
};

RevisionsPlugin.prototype.getRevisions = function(success, failure) {
    $.ajax({
        url: this.options.url,
        data: {

        }
    }).done(function() {
        // this will be run when the AJAX request succeeds
        success('success');
    }).fail(function() {
        // this will be run when the AJAX request fails
        failure('failure');
    }).always(function() {
        // this will be run when the AJAX request is complete, whether it fails or succeeds
    }).done(function() {
        // this will also be run when the AJAX request succeeds
    });
};

/**
 * @todo type and description for instance.
 * @param {type} instance
 * @return {jQuery} The "click to edit" button.
 */
RevisionsPlugin.prototype.getButton = function(instance) {
    var button = $.extend({}, RevisionsButton);
    button.raptor = this.raptor;
    button.options = this.options;
    button.plugin = instance;
    var ui = button.init();
    return ui;
};

Raptor.registerPlugin(new RevisionsPlugin());
