/**
 * @fileOverview UI Component for a tag-change select menu
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */
$.ui.editor.registerUi({

    /**
     * @name $.editor.plugin.tagMenu
     * @augments $.ui.editor.defaultPlugin
     * @class Select menu allowing users to change the tag for selection
     */
    tagMenu: /** @lends $.editor.plugin.tagMenu.prototype */ {

        validParents: [
            'blockquote', 'body', 'button', 'center', 'dd', 'div', 'fieldset', 'form', 'iframe', 'li',
            'noframes', 'noscript', 'object', 'td', 'th'
        ],

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor) {
            editor.bind('selectionChange', this.change, this);
            editor.bind('show', this.change, this);

            var ui = this;

            return editor.uiSelectMenu({
                name: 'tagMenu',
                title: _('Change HTML tag of selected element'),
                select: $(editor.getTemplate('tagmenu.menu')),
                change: function(value) {
                    // Prevent injection of illegal tags
                    if (typeof value === 'undefined' || value === 'na') {
                        return;
                    }

                    var editingElement = editor.getElement()[0];
                    var selectedElement = editor.getSelectedElements();
                    if (!editor.getSelectedHtml() || editor.getSelectedHtml() === '') {
                        // Do not attempt to modify editing element's tag
                        if ($(selectedElement)[0] === $(editingElement)[0]) {
                            return;
                        }
                        editor.saveSelection();
                        var replacementElement = $('<' + value + '>').html(selectedElement.html());
                        selectedElement.replaceWith(replacementElement);
                        editor.restoreSelection();
                    } else {
                        var selectedElementParent = $(editor.getSelectedElements()[0]).parent();
                        var temporaryClass = this.options.baseClass + '-selection';
                        var replacementHtml = $('<' + value + '>').html(editor.getSelectedHtml()).addClass(temporaryClass);

                        /*
                         * Replace selection if the selected element parent or the selected element is the editing element,
                         * instead of splitting the editing element.
                         */
                        if (selectedElementParent === editingElement
                            || editor.getSelectedElements()[0] === editingElement) {
                            editor.replaceSelection(replacementHtml);
                        } else {
                            editor.replaceSelectionWithinValidTags(replacementHtml, this.validParents);
                        }

                        editor.selectInner(editor.getElement().find('.' + temporaryClass).removeClass(temporaryClass));
                    }

                    editor.checkChange();
                }
            });
        },

        /**
         * Content changed event
         */
        change: function() {
            var tag = this.editor.getSelectedElements()[0];
            if (!tag) {
                $(this.ui.button).toggleClass('ui-state-disabled', true);
                return;
            }
            tag = tag.tagName.toLowerCase();
            if (this.ui.select.find('option[value=' + tag + ']').length) {
                this.ui.val(tag);
            } else {
                this.ui.val('na');
            }
            $(this.ui.button).toggleClass('ui-state-disabled', this.editor.getElement()[0] === this.editor.getSelectedElements()[0]);
        }
    }
});
