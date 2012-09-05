/**
 * @fileOverview UI Componenent for recommending & tracking maximum content length.
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

$.ui.editor.registerUi({

    /**
     * @name $.editor.ui.statistics
     * @augments $.ui.editor.defaultUi
     * @class Displays a button containing a character count for the editor content.
     * When button is clicked, a dialog containing statistics is displayed.
     * <br/>
     * Shows a dialog containing more content statistics when clicked
     */
    statistics: /** @lends $.editor.ui.statistics.prototype */ {

        /**
         * @name $.editor.ui.statistics.options
         * @namespace Default options
         * @see $.editor.ui.statistics
         * @type {Object}
         */
        options: /** @lends $.editor.ui.statistics.options.prototype */  {

            /**
             * @see $.editor.ui.statistics.options
             * @type {Boolean|Integer} To display a character count, set to an integer. Else set to false to just display the button.
             */
            maximum: null
        },

        /**
         * @see $.ui.editor.length#init
         */
        init: function(editor, options) {

            editor.bind('show', $.proxy(this.updateCount, this));
            editor.bind('change', $.proxy(this.updateCount, this));

            return this.editor.uiButton({
                title: _('Remaining characters before the recommended character limit is reached'),
                label: _('Initializing'),
                text: true,
                icon: 'ui-icon-dashboard',
                click: function() {
                    this.showStatistics();
                }
            });
        },

        /**
         * Update the associated UI element when the content has changed.
         */
        updateCount: function() {
            // <debug>
            if (debugLevel >= MID) debug('Updating length count');
            // </debug>

            var charactersRemaining = this.options.maximum - $('<div/>').html(this.editor.getCleanHtml()).text().length;
            var button = this.ui.button;
            // If maximum has been set to false, only show the icon button
            if (this.options.maximum === false) {
                button.button('option', 'text', false);
                return;
            }

            var label = null;
            if (charactersRemaining >= 0) {
                label = _('{{charactersRemaining}} characters remaining', { charactersRemaining: charactersRemaining });
            } else {
                label = _('{{charactersRemaining}} characters over limit', { charactersRemaining: charactersRemaining * -1 });
            }
            button.button('option', 'label', label);
            button.button('option', 'text', true);

            // Add the error state to the button's text element if appropriate
            if (charactersRemaining < 0) {
                button.addClass('ui-state-error');
            } else{
                // Add the highlight class if the remaining characters are in the "sweet zone"
                if (charactersRemaining >= 0 && charactersRemaining <= 15) {
                    button.addClass('ui-state-highlight').removeClass('ui-state-error');
                } else {
                    button.removeClass('ui-state-highlight ui-state-error');
                }
            }
        },

        showStatistics: function() {
            var dialog = this.processTemplate();

            dialog.dialog({
                modal: true,
                resizable: false,
                title: _('Content Statistics'),
                dialogClass: this.editor.options.dialogClass + ' ' + this.editor.options.baseClass,
                show: this.editor.options.dialogShowAnimation,
                hide: this.editor.options.dialogHideAnimation,
                buttons: [
                    {
                        text: _('OK'),
                        click: function() {
                            $(this).dialog('close');
                        }
                    }
                ],
                open: function() {
                    // Apply custom icons to the dialog buttons
                    var buttons = $(this).parent().find('.ui-dialog-buttonpane');
                    buttons.find('button:eq(0)').button({ icons: { primary: 'ui-icon-circle-check' }});
                },
                close: function() {
                    $(this).dialog('destroy').remove();
                }
            });
        },

        /**
         * Process and return the statistics dialog template.
         * @return {jQuery} The processed statistics dialog template
         */
        processTemplate: function() {
            var content = $('<div/>').html(this.editor.getCleanHtml()).text();
            var truncation = null;
            var charactersRemaining = this.options.maximum - content.length;
            if (charactersRemaining < 0) {
                truncation = _('Content contains more than {{limit}} characters and may be truncated', {
                    'limit': this.options.maximum
                });
            } else {
                truncation = _('Content will not be truncated');
            }

            var words = null;
            var totalWords = content.split(' ').length;
            if (totalWords == 1) {
                words = _('{{words}} word', { 'words': totalWords });
            } else {
                words = _('{{words}} words', { 'words': totalWords });
            }

            var sentences = null;
            var totalSentences = content.split('. ').length;
            if (totalSentences == 1) {
                sentences = _('{{sentences}} sentences', { 'sentences': totalSentences });
            } else {
                sentences = _('{{sentences}} sentences', { 'sentences': totalSentences });
            }

            var characters = null;
            if (charactersRemaining >= 0) {
                characters = _('{{characters}} characters, {{charactersRemaining}} remaining', {
                    'characters': content.length,
                    'charactersRemaining': charactersRemaining
                });
            } else {
                characters = _('{{characters}} characters, {{charactersRemaining}} over the recommended limit', {
                    'characters': content.length,
                    'charactersRemaining': charactersRemaining * -1
                });
            }

            return $(this.editor.getTemplate('statistics.dialog', {
                'characters': characters,
                'words': words,
                'sentences': sentences,
                'truncation': truncation
            }));
        }
    }
});
