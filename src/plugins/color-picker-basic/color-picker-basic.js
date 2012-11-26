function ColorPickerBasicMenu(options) {
    this.preview = true;
    Menu.call(this, {
        name: 'colorPickerBasic'
    });
}

ColorPickerBasicMenu.prototype = Object.create(Menu.prototype);

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
            selectionToggleWrapper('color', {
                classes: this.options.classes || this.options.cssPrefix + 'color ' + this.options.cssPrefix + color
            });
        }
//        var applier = rangy.createCssClassApplier('cms-' + color, {
//            elementTagName: 'span'
//        });
//        applier.toggleSelection(this.raptor.getSelection());
    }.bind(this));
};

ColorPickerBasicMenu.prototype.mouseEnter = function(event) {
    if (this.preview) {
        this.raptor.actionPreview(function() {
            this.changeColor($(event.currentTarget).data('color'));
        }.bind(this));
    }
};

ColorPickerBasicMenu.prototype.mouseLeave = function() {
    if (this.preview) {
        this.raptor.actionPreviewRestore();
    }
};

ColorPickerBasicMenu.prototype.click = function() {
    this.raptor.actionApply(function() {
        this.changeColor($(event.currentTarget).data('color'));
    }.bind(this));
};

ColorPickerBasicMenu.prototype.getMenu = function() {
    if (!this.menu) {
        this.menuContent = this.editor.getTemplate('color-picker-basic.menu', this.options);
        var menu = Menu.prototype.getMenu.call(this)
            .find('[data-color]')
            .click(this.click.bind(this))
            .mouseenter(this.mouseEnter.bind(this))
            .mouseleave(this.mouseLeave.bind(this));
    }
    return this.menu;
}

Raptor.registerUi(new ColorPickerBasicMenu());
