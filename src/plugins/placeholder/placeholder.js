/**
 * @fileOverview Placeholder text component.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Placeholder plugin
 *
 * @constructor
 * @augments RaptorPlugin
 * @param {[type]} name
 * @param {[type]} overrides
 */
function PlaceholderPlugin(name, overrides) {

    /**
     * Default placholder plugin options.
     *
     * @type {Object}
     */
    this.options = {

        /**
         * The placeholder content used if the Raptor Editor's instance has no content.
         *
         * @type {String}
         */
        content: tr('placeholderPluginDefaultContent'),

        /**
         * Tag to wrap placeholder content.
         *
         * @type {String}
         */
        tag: 'p',

        /**
         * Select placeholder content when inserted.
         *
         * @type {Boolean}
         */
        select: true
    };

    RaptorPlugin.call(this, name || 'placeholder', overrides);
}

PlaceholderPlugin.prototype = Object.create(RaptorPlugin.prototype);

/**
 * Init placeholder plugin.
 */
PlaceholderPlugin.prototype.init = function() {
    this.raptor.bind('enabled', this.enabled.bind(this));
    this.raptor.bind('change', this.check.bind(this));
};

/**
 * Insert the placeholder if the editable element is empty.
 */
PlaceholderPlugin.prototype.enabled = function() {
    this.check(this.raptor.getHtml());
};

PlaceholderPlugin.prototype.check = function(html) {
    html = html.trim();
    if (!html || html === '<br>' || html === '<div><br></div>') {
        var raptorNode = this.raptor.getNode(),
            tag = document.createElement(this.options.tag);
        tag.innerHTML = this.options.content;
        raptorNode.innerHTML = '';
        raptorNode.appendChild(tag);
        if (this.options.select) {
            selectionSelectInner(raptorNode.childNodes[0]);
        }
        this.raptor.checkChange();
    }
};

Raptor.registerPlugin(new PlaceholderPlugin());
