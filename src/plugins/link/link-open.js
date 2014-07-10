/**
 * @fileOverview Contains the link open class code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 */

/**
 * The link open plugin class.
 *
 * @constructor
 * @augments RaptorPlugin
 *
 * @param {String} name
 * @param {Object} overrides Options hash.
 */
function LinkOpen(name, overrides) {
    RaptorPlugin.call(this, name || 'linkOpen', overrides);
}

LinkOpen.prototype = Object.create(RaptorPlugin.prototype);

LinkOpen.prototype.enable = function() {
    this.raptor.getElement().on('click.raptor', 'a', this.openLink);
};

LinkOpen.prototype.openLink = function(event) {
    if (event.ctrlKey && this.href) {
        window.open(this.href, '_blank');
    }
};

Raptor.registerPlugin(new LinkOpen());
