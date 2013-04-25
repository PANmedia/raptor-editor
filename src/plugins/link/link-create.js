/**
 * @fileOverview Contains the create link button code.
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

/**
 * Creates an instance of the dialog toggle button to create links.
 *
 * @todo param stuff?
 * @param {type} param
 */
Raptor.registerUi(new DialogToggleButton({
    name: 'linkCreate',

    dialogOptions: {
        width: 850
    },

    applyAction: function() {
        this.raptor.actionApply(function() {
            selectionExpandToWord();
            selectionExpandTo('a', this.raptor.getElement());
            selectionTrim();
            var applier = rangy.createApplier({
                tag: 'a',
                attributes: linkAttributes
            });
            if (linkAttributes !== false && $.trim(linkAttributes.href) !== '') {
                applier.applyToSelection();
                cleanEmptyElements(this.raptor.getElement(), ['a']);
            }
        }.bind(this));
    },

    openDialog: function() {
        var element = selectionGetElement();
        if (element.is('a')) {
            for (var i = 0, l = linkTypes.length; i < l; i++) {
                var result = linkTypes[i].updateInputs(element, linkContent.children('div:eq(' + i + ')'));
                if (result) {
                    linkMenu.find(':radio:eq(' + i + ')').trigger('click');
                }
            }
        }
    },

    validateDialog: function() {
        var i = linkMenu.find(':radio:checked').val();
        linkAttributes = linkTypes[i].getAttributes(linkContent.children('div:eq(' + i + ')'));
        return linkAttributes !== false;
    },

    selectionToggle: function() {
        var applier = rangy.createApplier({
            tag: 'a'
        });
        return applier.isAppliedToSelection();
    },

    getDialogTemplate: function() {
        var template = $(this.raptor.getTemplate('link.dialog', this.options));

        linkMenu = template.find('[data-menu]');
        linkContent = template.find('[data-content]');
        linkTypes = [
            new LinkTypeInternal(this.raptor),
            new LinkTypeExternal(this.raptor),
            new LinkTypeDocument(this.raptor),
            new LinkTypeEmail(this.raptor)
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
