var statisticsDialog = null;

Raptor.registerUi(new Button({
    name: 'statistics',
    maximum: 100,
    showCountInButton: true,

    init: function() {
        if (this.showCountInButton) {
            this.raptor.bind('change', this.updateButton.bind(this));
        }
        return Button.prototype.init.apply(this, arguments);
    },

    action: function() {
        this.processDialog();
        aDialogOpen(this.getDialog());
    },

    getCharacters: function() {
        return $('<div>').html(this.raptor.getHtml()).text().length;
    },

    updateButton: function() {
        var charactersRemaining = null,
            label = null,
            characters = this.getCharacters();

        // Cases where maximum has been provided
        if (this.maximum) {
            charactersRemaining = this.maximum - characters;
            if (charactersRemaining >= 0) {
                label = _('statisticsButtonCharacterRemaining', {
                    charactersRemaining: charactersRemaining
                });
            } else {
                label = _('statisticsButtonCharacterOverLimit', {
                    charactersRemaining: charactersRemaining * -1
                });
            }
        } else {
            label = _('statisticsButtonCharacters', {
                characters: characters
            });
        }

        aButtonSetLabel(this.button, label);

        if (!this.maximum) {
            return;
        }

        // Add the error state to the button's text element if appropriate
        if (charactersRemaining < 0) {
            this.button.addClass('ui-state-error').removeClass('ui-state-default');
        } else{
            // Add the highlight class if the remaining characters are in the "sweet zone"
            if (charactersRemaining >= 0 && charactersRemaining <= 15) {
                this.button.addClass('ui-state-highlight').removeClass('ui-state-error ui-state-default');
            } else {
                this.button.removeClass('ui-state-highlight ui-state-error').addClass('ui-state-default');
            }
        }
    },

    getButton: function() {
        if (!this.button) {
            Button.prototype.getButton.call(this);
            aButton(this.button, {
                text: true
            });
            if (this.showCountInButton) {
                this.updateButton();
            }
        }
        return this.button;
    },

    getDialog: function() {
        if (!statisticsDialog) {
            statisticsDialog = $(this.raptor.getTemplate('statistics.dialog'))
            aDialog(statisticsDialog, {
                modal: true,
                resizable: false,
                autoOpen: false,
                width: 350,
                title: _('statisticsDialogTitle'),
                dialogClass: this.options.dialogClass,
                buttons: [
                    {
                        text: _('statisticsDialogOKButton'),
                        click: function() {
                            aDialogClose(statisticsDialog);
                        }.bind(this),
                        icons: {
                            primary: 'ui-icon-circle-check'
                        }
                    }
                ]
            });
        }
        return statisticsDialog;
    },

    /**
     * Process and return the statistics dialog template.
     * @return {jQuery} The processed statistics dialog template
     */
    processDialog: function() {
        var dialog = this.getDialog();
        var content = $('<div/>').html(this.raptor.getHtml()).text();

        // If maximum has not been set, use infinity
        var charactersRemaining = this.options.maximum ? this.options.maximum - content.length : '&infin;';
        if (typeIsNumber(charactersRemaining)) {
            dialog.find('[data-name=truncation]').html(_('statisticsDialogNotTruncated', {
                'limit': this.options.maximum
            }));
        } else {
            dialog.find('[data-name=truncation]').html(_('statisticsDialogNotTruncated'));
        }

        var totalWords = content.split(' ').length;
        if (totalWords === 1) {
            dialog.find('[data-name=words]').html(_('statisticsDialogWord', {
                words: totalWords
            }));
        } else {
            dialog.find('[data-name=words]').html(_('statisticsDialogWords', {
                words: totalWords
            }));
        }

        var totalSentences = content.split('. ').length;
        if (totalSentences === 1) {
            dialog.find('[data-name=sentences]').html(_('statisticsDialogSentence', {
                sentences: totalSentences
            }));
        } else {
            dialog.find('[data-name=sentences]').html(_('statisticsDialogSentences', {
                sentences: totalSentences
            }));
        }

        var characters = null;
        if (charactersRemaining >= 0 || !typeIsNumber(charactersRemaining)) {
            dialog.find('[data-name=characters]').html(_('statisticsDialogCharactersRemaining', {
                characters: content.length,
                charactersRemaining: charactersRemaining
            }));
        } else {
            dialog.find('[data-name=characters]').html(_('statisticsDialogCharactersOverLimit', {
                characters: content.length,
                charactersRemaining: charactersRemaining * -1
            }));
        }
    }
}));
