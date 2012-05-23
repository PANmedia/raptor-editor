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
     * @name $.editor.plugin.unsavedEditWarning.options
     * @namespace Default options
     * @see $.editor.plugin.unsavedEditWarning
     * @type {Object}
     */
    options: /** @lends $.editor.plugin.unsavedEditWarning.options.prototype */  {

        /**
         * @see $.editor.plugin.unsavedEditWarning.options
         * @type {Object}
         */
//        position: {
//            collision: 'right bottom',
//            at: 'right bottom',
//            my: 'right bottom',
//            using: function(position) {
//                $(this).css({
//                    position: 'absolute',
//                    top: position.top,
//                    left: position.left
//                });
//            }
//        }
    },

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {
        if (!warning) {
            warning = $(editor.getTemplate('unsavededitwarning.warning', this.options))
                .attr('id', editor.getUniqueId())
                .appendTo('body');
        }

        var plugin = this;
        editor.bind('dirty', function() {
            dirty++;
            if (dirty > 0) {
                warning.addClass(plugin.options.baseClass + '-visible');
            }
        });

        editor.bind('cleaned', function() {
            dirty--;
            if (dirty === 0) {
                warning.removeClass(plugin.options.baseClass + '-visible');
            }
        });

//        editor.bind('change', function() {
//            if (editor.isDirty() && editor.isEditing()) this.show();
//            else this.hide();
//        }, this);
//
//        editor.bind('destroy', function() {
//            this.warning.remove();
//            this.warning = null;
//        }, this);
    },

    /**
     * Show the warning
     */
    show: function() {
//        this.reposition();
//        this.warning.addClass(this.options.baseClass + '-visible').show();
    },

    /**
     * Hide the warning
     */
    hide: function() {
//        this.warning.removeClass(this.options.baseClass + '-visible');
    },

    /**
     * Reposition the warning according to the element's dimensions
     */
    reposition: function() {
//        // Have to use the ID because if given the element, the browser will memory leak and crash
//        this.options.position.of = '#' + this.editor.getElement().attr('id');
//        // <strict>
//        if (!$(this.options.position.of).length) {
//            handleError(_('Editor element has been removed, unsaved edit warning plugin cannot reposition'));
//        }
//        // </strict>
//        this.warning.position(this.options.position);
    }
});

})();