console.info('FIXME: fontsize (execcommand)')
$.ui.editor.addButton('increaseFontSize', function(editor) {
    this.title = _('Increase Font Size');
    this.icons = {
        primary: 'ui-icon-font-increase'
    };
    this.classes = 'ui-editor-icon';
    this.click = function() {
        this._actions.beforeStateChange.call(this);
        this._selection.enforceLegality.call(this);

        editor.execCommand('increasefontsize', false, null);

        this._actions.stateChange.call(this);
    }
});

$.ui.editor.addButton('decreaseFontSize', function(editor) {
    this.title = _('Decrease Font Size');
    this.icons = {
        primary: 'ui-icon-font-decrease'
    };
    this.classes = 'ui-editor-icon';
    this.click = function() {
        this._actions.beforeStateChange.call(this);
        this._selection.enforceLegality.call(this);

        editor.execCommand('decreasefontsize', false, null);

        this._actions.stateChange.call(this);
    }
});
