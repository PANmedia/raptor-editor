/**
 * @fileOverview UI Componenent for recommending & tracking maximum content length.
 * @author Michael Robinson michael@panmedia.co.nz
 * @author David Neilsen david@panmedia.co.nz
 */

$.ui.editor.registerUi({

    /**
     * @name $.editor.ui.statistics
     * @augments $.ui.editor.defaultUi
     * @see $.editor.ui.statistics.options
     * @class Displays a button containing a character count for the editor content.
     * When button is clicked, a dialog containing statistics is displayed.
     * Shows a dialog containing more content statistics when clicked.
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
             * @type {Boolean|Integer} To display a character count, set to an integer.
             * Else set to false to just display the button.
             */
            maximum: null,

            /**
             * @type {Boolean} True to show count & other text in button, false
             * for icon only.
             */
            showCountInButton: true,

            /**
             * @type {String} Text to use for the button's title when
             * {@link $.editor.ui.statistics.options.maximum} has been provided.
             */
            characterLimitTitle: _('Remaining characters before the recommended character limit is reached. Click to view statistics'),

            /**
             * @type {String} Text to use for the button's title when
             * {@link $.editor.ui.statistics.options.maximum} has not been provided.
             */
            characterCountTitle: _('Click to view statistics')
        },

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {

            editor.bind('show', $.proxy(this.updateCount, this));
            editor.bind('change', $.proxy(this.updateCount, this));

            return this.editor.uiButton({
                title: typeIsNumber(this.options.maximum) ? this.options.characterLimitTitle : this.options.characterCountTitle,
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
         * If {@link $.editor.ui.statistics.options.maximum} has not been specified, a character count is shown.
         * If it has been specified, a remaining character count is shown.
         */
        updateCount: function() {
            // <debug>
            if (debugLevel >= MID) debug('Updating length count');
            // </debug>

            var charactersRemaining = null;
            var label = null;
            var characters = $('<div/>').html(this.editor.getCleanHtml()).text().length;

            // Cases where maximum has been provided
            if (typeIsNumber(this.options.maximum)) {
                charactersRemaining = this.options.maximum - characters;
                if (charactersRemaining >= 0) {
                    label = _('{{charactersRemaining}} characters remaining', { charactersRemaining: charactersRemaining });
                } else {
                    label = _('{{charactersRemaining}} characters over limit', { charactersRemaining: charactersRemaining * -1 });
                }
            } else {
                label = _('{{characters}} characters', { characters: characters });
            }

            var button = this.ui.button;

            // If maximum has been set to false, only show the icon button
            if (this.options.showCountInButton === false) {
                button.button('option', 'text', false);
            }

            button.button('option', 'label', label);
            button.button('option', 'text', true);

            if (!typeIsNumber(this.options.maximum)) {
                return;
            }

            // Add the error state to the button's text element if appropriate
            if (charactersRemaining < 0) {
                button.addClass('ui-state-error').removeClass('ui-state-default');
            } else{
                // Add the highlight class if the remaining characters are in the "sweet zone"
                if (charactersRemaining >= 0 && charactersRemaining <= 15) {
                    button.addClass('ui-state-highlight').removeClass('ui-state-error ui-state-default');
                } else {
                    button.removeClass('ui-state-highlight ui-state-error').addClass('ui-state-default');
                }
            }
        },

        /**
         * Create & show the statistics dialog.
         */
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

            // If maximum has not been set, use infinity
            var charactersRemaining = this.options.maximum ? this.options.maximum - content.length : '&infin;';
            if (typeIsNumber(charactersRemaining)) {
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
            if (charactersRemaining >= 0 || !typeIsNumber(charactersRemaining)) {
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
