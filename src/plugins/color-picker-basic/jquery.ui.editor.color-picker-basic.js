/**
 * @fileOverview UI component basic color selection
 * @author David Neilsen david@panmedia.co.nz
 */
$.ui.editor.registerUi('colorPickerBasic', {
    /**
     * @see $.ui.editor.defaultUi#init
     */
    init: function(editor) {
        editor.bind('selectionChange', this.change, this);
        editor.bind('show', this.change, this);

        var ui = this;

        return editor.uiSelectMenu({
            name: 'colorPickerBasic',
            title: _('Change the color of the selected text.'),
            select: $(editor.getTemplate('color-picker-basic.menu')),
            change: function(value) {
                if (value === 'automatic') {
                    editor.getSelectedElements().parents('.' + ui.options.cssPrefix + 'color').andSelf().each(function() {
                        var element = $(this),
                            classes = $(this).attr('class').match(/(cms-(.*?))( |$)/ig);
                        $.each(classes, function(i, color) {
                            color = $.trim(color);
                            element.removeClass(color);
                        });
                    });
                } else {
                    editor.toggleWrapper('span', {
                        classes: ui.options.classes || ui.options.cssPrefix + 'color ' + ui.options.cssPrefix + value
                    });
                }
            }
        });
    },

    change: function() {
        this.ui.val('automatic');
        var tag = this.editor.getSelectedElements()[0];
        if (!tag) {
            return;
        }
        tag = $(tag).closest('.' + this.options.cssPrefix + 'color')
        if (!tag) {
            return;
        }

        var classes = tag.attr('class');
        if (classes) {
            classes = tag.attr('class').replace(new RegExp(this.options.cssPrefix + 'color', 'g'), '');
            var color = classes.match(/cms-(.*?)( |$)/i)[1];
            if (this.ui.select.find('.ui-editor-selectmenu-option[value=' + color + ']').length) {
                this.ui.val(color);
            }
        }
    }
});
