/**
 * Create link plugin.
 *
 * @plugin {DialogToggleButton} linkCreate
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */
var linkMenu,
    linkTypes,
    linkContent,
    linkAttributes;

Raptor.registerUi(new DialogToggleButton({
    name: 'linkCreate',

    options: {
        /**
         * Reset the UI when opening the dialog for a second time.
         * If set to false the previous user input is retained.
         * @option {boolean} resetUi
         */
        resetUi: false
    },

    dialogOptions: {
        width: 850
    },

    applyAction: function() {
        this.raptor.actionApply(function() {
            if (!linkAttributes || linkAttributes.href.trim() === '') {
                return;
            }

            // Update
            var range = window.getSelection().getRangeAt(0);
            if (range.commonAncestorContainer.tagName === 'A') {
                for (var linkAttribute in linkAttributes) {
                    range.commonAncestorContainer.setAttribute(linkAttribute, linkAttributes[linkAttribute]);
                }
                return;
            }

            // Create
            selectionExpandToWord();
            selectionExpandTo('a', this.raptor.getElement());
            selectionTrim();
            var applier = rangy.createApplier({
                tag: 'a',
                attributes: linkAttributes
            });
            applier.applyToSelection();
            cleanEmptyElements(this.raptor.getElement(), ['a']);
        }.bind(this));
    },

    getDialog: function() {
        var dialog = DialogToggleButton.prototype.getDialog.call(this);
        var element = selectionGetElement();
        for (var i = 0, l = linkTypes.length; i < l; i++) {
            if (element.is('a')) {
                var result = linkTypes[i].updateInputs(element, linkContent.children('div:eq(' + i + ')'));
                if (result) {
                    linkMenu.find(':radio:eq(' + i + ')').trigger('click');
                }
            } else if (this.options.resetUi) {
                linkTypes[i].resetInputs(linkContent.children('div:eq(' + i + ')'));
            }
        }
        if (!element.is('a') && this.options.resetUi) {
            linkMenu.find(':radio:eq(0)').trigger('click');
        }
        return dialog;
    },

    validateDialog: function() {
        var i = linkMenu.find(':radio:checked').val();
        linkAttributes = linkTypes[i].getAttributes(linkContent.children('div:eq(' + i + ')'));
        return linkAttributes !== false;
    },

    selectionToggle: function() {
        var element = selectionGetElement();
        if (!element) {
            return false;
        }
        if (element.closest('a').length) {
            return true;
        }
        return false;
    },

    getDialogTemplate: function() {
        var template = $(this.raptor.getTemplate('link.dialog', this.options));

        linkMenu = template.find('[data-menu]');
        linkContent = template.find('[data-content]');
        linkTypes = [
            new LinkTypeInternal(this),
            new LinkTypeExternal(this),
            new LinkTypeDocument(this),
            new LinkTypeEmail(this)
        ];

        for (var i = 0, l = linkTypes.length; i < l; i++) {
            $(this.raptor.getTemplate('link.label', linkTypes[i]))
                .click(function() {
                    linkContent.children('div').hide();
                    linkContent.children('div:eq(' + $(this).index() + ')').show();
                })
                .find(':radio')
                    .val(i)
                .end()
                .appendTo(linkMenu);
            $('<div>')
                .append(linkTypes[i].getContent())
                .hide()
                .appendTo(linkContent);
        }
        linkMenu.find(':radio:first').prop('checked', true);
        linkContent.children('div:first').show();

        return template;
    }
}));
