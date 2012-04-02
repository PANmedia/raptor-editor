/**
 * @fileOverview UI Component for displaying a warning in a corner of the element when unsaved edits exist
 * @author David Neilson david@panmedia.co.nz
 * @author Michael Robinson mike@panmedia.co.nz
 */

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
        position: {
            collision: 'right bottom',
            at: 'right bottom',
            my: 'right bottom',
            using: function(position) {
                $(this).css({
                    position: 'absolute',
                    top: position.top,
                    left: position.left
                });
            }
        }
    },

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {
        this.warning = $(editor.getTemplate('unsavededitwarning.warning', this.options))
            .attr('id', editor.getUniqueId())
            .appendTo('body');

        editor.bind('change', function() {
            if (editor.isDirty() && editor.isEditing()) this.show();
            else this.hide();
        }, this);

        editor.bind('destroy', function() {
            this.warning.remove();
            this.warning = null;
        }, this);
    },

    /**
     * Show the warning
     */
    show: function() {
        this.reposition();
        this.warning.addClass(this.options.baseClass + '-visible').show();
    },

    /**
     * Hide the warning
     */
    hide: function() {
        this.warning.removeClass(this.options.baseClass + '-visible');
    },

    /**
     * Reposition the warning according to the element's dimensions
     */
    reposition: function() {
        // Have to use the ID because if given the element, the browser will memory leak and crash
        this.options.position.of = '#' + this.editor.getElement().attr('id');
        // <strict>
        if (!$(this.options.position.of).length) {
            handleError(_('Editor element has been removed, unsaved edit warning plugin cannot reposition'));
        }
        // </strict>
        this.warning.position(this.options.position);
    }
});

$.ui.editor.bind('resize', function() {
    var instances = this.getInstances();
    for (var i = 0; i < instances.length; i++) {
        if (instances[i].getPlugin('unsavedEditWarning')) {
            instances[i].getPlugin('unsavedEditWarning').reposition();
        }
    };
});
