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

    button: false,

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
        var timeoutId = false;

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

            var editButton = plugin.getButton();

            var visibleRect = elementVisibleRect(editor.getElement());
            editButton.css({
                position: 'absolute',
                // Calculate offset center for the button
                top: visibleRect.top + ((visibleRect.height / 2) - ($(editButton).outerHeight() / 2)),
                left: visibleRect.left + (visibleRect.width / 2) - ($(editButton).outerWidth() / 2)
            });
            editButton.addClass(options.baseClass + '-visible');
        };

        /**
         * Hide the click to edit button
         */
        this.hide = function(event) {
            var editButton = plugin.getButton();
            if((event &&
                    (event.relatedTarget === editButton.get(0) ||
                     editButton.get(0) === $(event.relatedTarget).parent().get(0)))) {
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

        this.buttonOut = function(event) {
            if (plugin.getButton().hasClass(options.baseClass + '-visible')) {
                return;
            }
            window.clearTimeout(plugin.timeoutId);
            // Set timeout for cases where the user mousesout of the element
            // too quickly to trigger event properly
            plugin.timeoutId = window.setTimeout(plugin.hide, 350);
        };

        editor.getElement().addClass('ui-editor-click-button-to-edit');

        editor.bind('ready, hide, cancel', function() {
            editor.getElement().bind('mouseenter.' + editor.widgetName, plugin.show);
            editor.getElement().bind('mouseleave.' + editor.widgetName, plugin.hide);
        });

        editor.bind('show', function() {
            plugin.destroyButton();
            editor.getElement().unbind('mouseenter.' + editor.widgetName, plugin.show);
            editor.getElement().unbind('mouseleave.' + editor.widgetName, plugin.hide);
        });
    },

    getButton: function() {
        if (this.button === false) {
            this.button = $(this.editor.getTemplate('clickbuttontoedit.edit-button', this.options))
                .appendTo('body')
                .removeClass(this.options.baseClass + '-visible');
            this.button.button(this.options.button);
        }

        this.button.unbind('click.' + this.editor.widgetName)
            .bind('click.' + this.editor.widgetName, this.edit);
        this.button.unbind('mouseleave.' + this.editor.widgetName)
            .bind('mouseleave.' + this.editor.widgetName, this.buttonOut);

        return this.button;
    },

    destroyButton: function() {
        if (typeof this.button === 'undefined' || this.button === false) {
            return;
        }
        this.button.button('destroy').remove();
        this.button = false;
    }
});
