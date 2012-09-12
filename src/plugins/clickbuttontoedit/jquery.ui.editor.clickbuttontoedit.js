/**
 * @fileOverview Click button to edit plugin.
 * @author Michael Robinson michael@panmedia.co.nz
 * @author David Neilsen david@panmedia.co.nz
 */

$.ui.editor.registerPlugin({

     /**
      * @name $.editor.plugin.clickButtonToEdit
      * @augments $.ui.editor.defaultPlugin
      * @see $.editor.plugin.clickButtonToEdit.options
      * @class Shows a button at the center of an editable block,
      * informing the user that they may click said button to edit the block contents.
      */
    clickButtonToEdit: /** @lends $.editor.plugin.clickButtonToEdit.prototype */ {

        hovering: false,

        buttonClass: null,
        buttonSelector: null,
        button: false,

        /**
         * @name $.editor.plugin.clickButtonToEdit.options
         * @namespace Default click button to edit options.
         * @see $.editor.plugin.clickButtonToEdit
         * @type {Object}
         */
        options: /** @lends $.editor.plugin.clickButtonToEdit.options.prototype */  {
            /**
             * @default
                <pre>{
                    text: true,
                    icons: {
                        primary: 'ui-icon-pencil'
                    }
                }</pre>
             * @type {Object} jQuery UI button options
             */
            button: {
                text: true,
                icons: {
                    primary: 'ui-icon-pencil'
                }
            },
            /**
             * @type {Function} Callback executed when button is clicked.
             * If the function returns false, the editor will not be enabled.
             */
            callback: null
        },

        /**
         * Initialize the click button to edit plugin.
         * @see $.ui.editor.defaultPlugin#init
         * @param  {$.editor} editor The Raptor Editor instance.
         * @param  {$.editor.plugin.clickButtonToEdit.options} options The options object.
         * @return {$.editor.defaultPlugin} A new $.ui.editor.plugin.clickButtonToEdit instance.
         */
        init: function(editor, options) {

            var plugin = this;
            var timeoutId = false;
            this.buttonClass = this.options.baseClass + '-button-element';
            this.buttonSelector = '.' + this.buttonClass;

            /**
             * Show the click to edit button.
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
            };

            /**
             * Hide the click to edit button.
             * @param  {Event} event The event triggering this function.
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
                plugin.destroyButton();
            };

            /**
             * Hide the click to edit button and show toolbar.
             */
            this.edit = function() {
                // If a callback has been provided, call it.
                if (plugin.options.callback && $.isFunction(plugin.options.callback)) {
                    if (plugin.options.callback.call(plugin) === false) {
                        return false;
                    }
                }
                plugin.hide();
                if (!editor.isEditing()) editor.enableEditing();
                if (!editor.isVisible()) editor.showToolbar();
            };

            /**
             * Trigger the $.editor.plugin.clickButtonToEdit#hide function if
             * the user moves the mouse off the too quickly for the element's
             * mouseleave event to fire.
             * @param  {Event} event The event.
             */
            this.buttonOut = function(event) {
                if (event.relatedTarget === plugin.getButton().get(0) ||
                    (event.relatedTarget === editor.getElement().get(0) || $.contains(editor.getElement().get(0), event.relatedTarget))) {
                    return;
                }
                plugin.hide();
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

        /**
         * Selects or creates the button and returns it.
         * @return {jQuery} The "click to edit" button.
         */
        getButton: function() {
            if (!$(this.buttonSelector).length) {
                this.button = $(this.editor.getTemplate('clickbuttontoedit.edit-button', this.options))
                    .appendTo('body')
                    .addClass(this.buttonClass);
                this.button.button(this.options.button);
            }

            this.button = $(this.buttonSelector);

            this.button.unbind('click.' + this.editor.widgetName)
                .bind('click.' + this.editor.widgetName, this.edit);
            this.button.unbind('mouseleave.' + this.editor.widgetName)
                .bind('mouseleave.' + this.editor.widgetName, this.buttonOut);

            return this.button;
        },

        /**
         * Destroys the "click to edit button".
         */
        destroyButton: function() {
            if (typeof this.button === 'undefined' || this.button === false) {
                return;
            }
            this.button.button('destroy').remove();
            this.button = false;
        }
    }
});
