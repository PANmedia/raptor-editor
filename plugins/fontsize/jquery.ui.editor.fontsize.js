(function($) {
   
    $.ui.editor.addButton('increaseFontSize', {
        title: 'Increase Font Size',
        icons: {
            primary: 'ui-icon-font-increase'
        },
        classes: 'ui-editor-icon',
        click: function() {
            this._actions.beforeStateChange.call(this);
            this._selection.enforceLegality.call(this);

            document.execCommand('increasefontsize', false, null);

            this._actions.stateChange.call(this);
        }
    });
    
    $.ui.editor.addButton('decreaseFontSize', {
        title: 'Decrease Font Size',
        icons: {
            primary: 'ui-icon-font-decrease'
        },
        classes: 'ui-editor-icon',
        click: function() {
            this._actions.beforeStateChange.call(this);
            this._selection.enforceLegality.call(this);

            document.execCommand('decreasefontsize', false, null);

            this._actions.stateChange.call(this);
        }
    });
})(jQuery);
