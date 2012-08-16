/**
 * @fileOverview Click button to edit plugin
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

 /**
  * @name $.editor.plugin.clickButtonToEdit
  * @augments $.ui.editor.defaultPlugin
  * @class Shows a button at the center of an editable block,
  * informing the user that they may click said button to edit the block contents
  */
$.ui.editor.registerPlugin('clickButtonToEdit', /** @lends $.editor.plugin.clickButtonToEdit.prototype */ {

    hovering: false,

    /** @type {Object} Plugin option defaults. */
    options: {
        button: {
            text: true,
            icons: {
                primary: 'ui-icon-pencil'
            }
        }
    },

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {

        var plugin = this;
        var editButton = false;
        var timeoutId = false;

        /** @type {Object} Plugin option defaults. */
        options = $.extend(true, {}, {

            /** @type {Boolean} true if links should be obscured */
            position: {
                at: 'center center',
                of: editor.getElement(),
                my: 'center center',
                using: function(position) {
                    $(this).css({
                        position: 'absolute',
                        top: position.top,
                        left: position.left
                    });
                }
            }
        }, options);

        this.selection = function() {
            var range;
            if (document.selection) {   // IE
                range = document.selection.createRange();
            } else if (document.getSelection().rangeCount) {    // Others
                range = document.getSelection().getRangeAt(0);
            }
            return range;
        };

        /**
         * Show the click to edit button
         */
        this.show = function() {
            if (editor.isEditing()) return;
            editor.getElement().addClass(options.baseClass + '-highlight');
            editor.getElement().addClass(options.baseClass + '-hover');

            editButton.button(options.button);
            editButton.position(options.position);
            editButton.addClass(options.baseClass + '-visible');
        };

        /**
         * Hide the click to edit button
         */
        this.hide = function(event) {
            window.clearTimeout(plugin.timeoutId);
            if((event &&
                    (event.relatedTarget === editButton.get(0) ||
                     editButton.get(0) === $(event.relatedTarget).parent().get(0)))) {
                // Set timeout for cases where the user mousesout of the element
                // too quickly to trigger event properly
                plugin.timeoutId = window.setTimeout(plugin.hide, 350);
                return;
            }
            editor.getElement().removeClass(options.baseClass + '-highlight');
            editor.getElement().removeClass(options.baseClass + '-hover');
            editButton.removeClass(options.baseClass + '-visible');
        };

        /**
         * Hide the click to edit button and show toolbar
         */
        this.edit = function() {
            plugin.hide();
            if (!editor.isEditing()) editor.enableEditing();
            if (!editor.isVisible()) editor.showToolbar(plugin.selection());
        };

        editor.bind('ready, hide, cancel', function() {

            editButton = $(editor.getTemplate('clickbuttontoedit.edit-button', options))
                .appendTo('body')
                .removeClass(options.baseClass + '-visible');

            editButton.position(options.position);

            editButton.bind('click.' + editor.widgetName, plugin.edit);

            editor.getElement().bind('mouseenter.' + editor.widgetName, plugin.show);
            editor.getElement().bind('mouseleave.' + editor.widgetName, plugin.hide);
        });

        editor.bind('show', function() {
            editButton.button('destroy').remove();
            editor.getElement().unbind('mouseenter.' + editor.widgetName, plugin.show);
            editor.getElement().unbind('mouseleave.' + editor.widgetName, plugin.hide);
        });
    }
});
