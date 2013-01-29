var cancelDialog = null,
    cancelInstance;

Raptor.registerUi(new DialogButton({
    name: 'cancel',
    dialogOptions: {
        width: 500
    },
    applyAction: function() {
        this.raptor.cancelEditing();
    },
    getDialogTemplate: function() {
        return $('<div>').html(_('cancelDialogContent'));
    }
}));
