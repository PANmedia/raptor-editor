/**
 * @fileOverview UI Component for displaying a warning in a corner of the element when unsaved edits exist
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */
(function() {
    /**
     * The warning message node.
     * @type Element
     */
    var warning = null;

    /**
     * Amount of dirty blocks.
     * @type Element
     */
    var dirty = 0;

    /**
     * @name $.editor.plugin.unsavedEditWarning
     * @augments $.ui.editor.defaultPlugin
     * @see $.editor.plugin.unsavedEditWarning.options
     * @class
     */
    $.ui.editor.registerPlugin('unsavedEditWarning', /** @lends $.editor.plugin.unsavedEditWarning.prototype */ {

        /**
         * @see $.ui.editor.defaultPlugin#init
         */
        init: function(editor, options) {
            var plugin = this;

            if (!warning) {
                warning = $(editor.getTemplate('unsavededitwarning.warning', this.options))
                    .attr('id', editor.getUniqueId())
                    .appendTo('body')
                    .bind('mouseenter.' + editor.widgetName, function() {
                        $.ui.editor.eachInstance(function(editor) {
                            if (editor.isDirty()) {
                                editor.getElement().addClass(plugin.options.baseClass + '-dirty');
                            }
                        });
                    })
                    .bind('mouseleave.' + editor.widgetName, function() {
                        $('.' + plugin.options.baseClass + '-dirty').removeClass(plugin.options.baseClass + '-dirty');
                    });
            }

            editor.bind('dirty', function() {
                dirty++;
                if (dirty > 0) {
                    elementBringToTop(warning);
                    warning.addClass(plugin.options.baseClass + '-visible');
                }
            });

            editor.bind('cleaned', function() {
                dirty--;
                if (dirty === 0) {
                    warning.removeClass(plugin.options.baseClass + '-visible');
                }
            });
        }

    });

})();