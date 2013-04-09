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
        content: _('placeholderPluginDefaultContent'),

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
 * Bind placeholder show to Raptor Editor's show event.
 */
PlaceholderPlugin.prototype.init = function() {
    this.raptor.bind('show', this.show.bind(this));
};

/**
 * Show the placeholder if Raptor Editor instance has no content.
 */
PlaceholderPlugin.prototype.show = function() {
    if (!$.trim(this.raptor.getHtml())) {
        var content = $(document.createElement(this.options.tag))
                            .html(this.options.content);
        this.raptor.setHtml(content);
        if (this.options.select) {
            selectionSelectInner(content.get(0));
        }
    }
};

Raptor.registerPlugin(new PlaceholderPlugin());
