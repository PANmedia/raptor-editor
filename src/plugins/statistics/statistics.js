var statisticsDialog = null;

Raptor.registerUi(new Button({
    name: 'statistics',
    
    action: function() {
        this.processDialog();
        aDialogOpen(this.getDialog());
    },

    getCharacters: function() {
        return $('<div>').html(this.raptor.getCleanHtml()).text().length;
    },

    getButton: function() {
        if (!this.button) {
            this.text = _('statisticsCharacters', {
                characters: this.getCharacters()
            });
            Button.prototype.getButton.call(this);
            aButton(this.button, {
                text: true
            });
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
        var content = $('<div/>').html(this.editor.getCleanHtml()).text();

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
