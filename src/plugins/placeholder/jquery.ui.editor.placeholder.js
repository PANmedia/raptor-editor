/**
 * @fileOverview Placeholder text component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

$.ui.editor.registerPlugin('placeholder', /** @lends $.editor.plugin.placeholder.prototype */ {

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {
        var plugin = this;

        /**
        * Plugin option defaults
        * @type {Object}
        */
        options = $.extend({}, {
            /**
             * Content to insert into an editable element if said element is empty on initialisation
             * @default Placeholder content
             * @type {String}
             */
            content: '[Your content here]',

            /**
             * Tag to wrap content
             * @default p
             * @type {String}
             */
            tag: 'p',

            /**
             * Select content on insertion
             * @default true
             * @type {Boolean} False to prevent automatic selection of inserted placeholder
             */
            select: true
        }, options);

        /**
         * Show the click to edit message
         */
        this.show = function() {
            if (!$.trim(editor.getElement().html())) {

                var content = $(document.createElement(options.tag)).html(options.content);
                editor.getElement().html(content);

                if (options.select) {
                    selectionSelectInner(content);
                }
            }
        };

        editor.bind('show', plugin.show);
    }
});