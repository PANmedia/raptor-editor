$.ui.editor.registerUi('textBold', new Button({
    name: 'bold',
    title: _('bold'),
    hotkey: 'ctrl+b',
    options: {},
    action: function() {
        selectionToggleWrapper('strong', {
            classes: this.options.classes || this.options.cssPrefix + 'bold'
        });
    }
}));
