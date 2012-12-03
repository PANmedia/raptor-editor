function ColorPickerBasicMenu(options) {
    this.preview = true;
    this.colors = [
        'white',
        'black',
        'grey',
        'blue',
        'red',
        'green',
        'purple',
        'orange'
    ]
    SelectMenu.call(this, {
        name: 'colorPickerBasic'
    });
}

ColorPickerBasicMenu.prototype = Object.create(SelectMenu.prototype);

ColorPickerBasicMenu.prototype.init = function(raptor) {
    raptor.bind('selectionChange', this.updateButton.bind(this));
    return SelectMenu.prototype.init.apply(this, arguments);
};

ColorPickerBasicMenu.prototype.updateButton = function() {
    var tag = selectionGetElements()[0],
        button = this.getButton().getButton(),
        color = null,
        closest = null;
    // TODO: set automatic icon color to the color of the text
    aButtonSetLabel(button, _('colorPickerBasicAutomatic'));
    aButtonSetIcon(button, false);
    if (!tag) {
        return;
    }
    tag = $(tag);
    for (var i = 0, l = this.colors.length; i < l; i++) {
        closest = $(tag).closest('.' + this.options.cssPrefix + this.colors[i]);
        if (closest.length) {
            color = this.colors[i];
            break;
        }
    }
    if (color) {
        aButtonSetLabel(button, _('colorPickerBasic' + (color.charAt(0).toUpperCase() + color.slice(1))));
        aButtonSetIcon(button, 'ui-icon-swatch');
        // FIXME: set color in an adapter friendly way
        button.find('.ui-icon').css('background-color', closest.css('color'));
        return;
    }
};

ColorPickerBasicMenu.prototype.changeColor = function(color) {
    this.raptor.actionApply(function() {
        if (color === 'automatic') {
            selectionGetElements().parents('.' + this.options.cssPrefix + 'color').andSelf().each(function() {
                var element = $(this),
                    classes = element.attr('class').match(/(cms-(.*?))( |$)/ig);
                for (var i = 0, l = classes.length; i < l; i++) {
                    element.removeClass($.trim(classes[i]));
                };
            });
        } else {
            selectionToggleWrapper('span', {
                classes: this.options.classes || this.options.cssPrefix + 'color ' + this.options.cssPrefix + color
            });
        }
//        var applier = rangy.createCssClassApplier('cms-' + color, {
//            elementTagName: 'span'
//        });
//        applier.toggleSelection(this.raptor.getSelection());
    }.bind(this));
};

ColorPickerBasicMenu.prototype.preview = function(event) {
    if (this.preview) {
        this.raptor.actionPreview(function() {
            this.changeColor($(event.currentTarget).data('color'));
        }.bind(this));
    }
};

ColorPickerBasicMenu.prototype.previewRestore = function() {
    if (this.preview) {
        this.raptor.actionPreviewRestore();
    }
};

ColorPickerBasicMenu.prototype.apply = function() {
    this.raptor.actionApply(function() {
        this.changeColor($(event.currentTarget).data('color'));
    }.bind(this));
};

ColorPickerBasicMenu.prototype.getButton = function() {
    if (!this.button) {
        this.button = new Button({
            name: this.name,
            action: this.show.bind(this),
            preview: false,
            options: this.options,
            text: true,
            icon: false,
            label: _('colorPickerBasicAutomatic')
        });
    }
    return this.button;
};

ColorPickerBasicMenu.prototype.getMenuItems = function() {
    return $(this.editor.getTemplate('color-picker-basic.menu', this.options))
        .click(this.apply.bind(this))
        .mouseenter(this.preview.bind(this))
        .mouseleave(this.previewRestore.bind(this));
};

Raptor.registerUi(new ColorPickerBasicMenu());
