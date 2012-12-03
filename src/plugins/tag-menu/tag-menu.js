function TagMenu(options) {
    SelectMenu.call(this, {
        name: 'tagMenu'
    });
}

TagMenu.prototype = Object.create(SelectMenu.prototype);

TagMenu.prototype.init = function(raptor) {
    raptor.bind('selectionChange', this.updateButton.bind(this));
    return SelectMenu.prototype.init.apply(this, arguments);
};

TagMenu.prototype.changeTag = function(tag) {
    // Prevent injection of illegal tags
    if (typeof tag === 'undefined' || tag === 'na') {
        return;
    }

    var editingElement = this.raptor.getElement()[0];
    var selectedElement = selectionGetElements();
    if (!selectionGetHtml() || selectionGetHtml() === '') {
        // Do not attempt to modify editing element's tag
        if ($(selectedElement)[0] === $(editingElement)[0]) {
            return;
        }
        selectionSave();
        var replacementElement = $('<' + tag + '>').html(selectedElement.html());
        selectedElement.replaceWith(replacementElement);
        selectionRestore();
    } else {
        var selectedElementParent = $(selectionGetElements()[0]).parent();
        var temporaryClass = this.options.baseClass + '-selection';
        var replacementHtml = $('<' + tag + '>').html(selectionGetHtml()).addClass(temporaryClass);

        /*
         * Replace selection if the selected element parent or the selected element is the editing element,
         * instead of splitting the editing element.
         */
        if (selectedElementParent === editingElement ||
            selectionGetElements()[0] === editingElement) {
            selectionReplace(replacementHtml);
        } else {
            selectionReplaceWithinValidTags(replacementHtml, this.validParents);
        }

        selectionSelectInner(this.raptor.getElement().find('.' + temporaryClass).removeClass(temporaryClass));
    }

    this.raptor.checkChange();
};

TagMenu.prototype.apply = function(event) {
    this.raptor.actionApply(function() {
        this.changeTag($(event.currentTarget).data('value'));
    }.bind(this));
};

TagMenu.prototype.preview = function(event) {
    if (this.preview) {
        this.raptor.actionPreview(function() {
            this.changeTag($(event.currentTarget).data('value'));
        }.bind(this));
    }
};

TagMenu.prototype.previewRestore = function(event) {
    if (this.preview) {
        this.raptor.actionPreviewRestore();
    }
};

TagMenu.prototype.updateButton = function() {
    var tag = selectionGetElements()[0],
        button = this.getButton().getButton();
    if (!tag) {
        aButtonDisable(button);
        return;
    }
    var tagName = tag.tagName.toLowerCase(),
        option = this.getMenu().find('[data-value=' + tagName + ']');
    if (option.length) {
        aButtonSetLabel(button, option.html());
    } else {
        aButtonSetLabel(button, _('tagMenuTagNA'));
    }
    if (this.editor.getElement()[0] === tag) {
        aButtonDisable(button);
    } else {
        aButtonEnable(button);
    }
};

TagMenu.prototype.getButton = function() {
    if (!this.button) {
        this.button = new Button({
            name: this.name,
            action: this.show.bind(this),
            preview: false,
            options: this.options,
            icon: false,
        });
    }
    return this.button;
};

TagMenu.prototype.getMenuItems = function() {
    return $(this.editor.getTemplate('tag-menu.menu', this.options))
        .click(this.apply.bind(this))
        .mouseenter(this.preview.bind(this))
        .mouseleave(this.previewRestore.bind(this));
};

Raptor.registerUi(new TagMenu());
