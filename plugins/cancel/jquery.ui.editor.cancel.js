console.info('FIXME: cancel button');
console.info('FIXME: cancel button confimation dialog');

$.ui.editor.registerUi({
    cancel: function(editor) {
        this.ui = editor.uiButton({
            name: 'cancel',
            title: _('Cancel'),
            icons: { primary: 'ui-icon-cancel' },
            click: function() {
                editor.resetHtml();
                editor.hideToolbar();
                editor.disableEditing();
//                this._dialog.confirmation.show.call(this, {
//                    message: _('Are you sure you want to stop editing? <br/><br/>All changes will be lost!'),
//                    title: _('Confirm Cancel Editing'),
//                    ok: function(){
//                        destroy();
//                    }
//                });
            }
        });
    }
});
