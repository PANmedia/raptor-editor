Raptor.registerUi(new DialogButton({
    name: 'cancel',
    dialogOptions: {
        width: 500
    },

    action: function() {
        if (this.raptor.isDirty()) {
            DialogButton.prototype.action.call(this);
        } else {
            this.applyAction();
        }
    },

    applyAction: function() {
        this.raptor.cancelEditing();
    },

    getDialogTemplate: function() {
        return $('<div>').html(_('cancelDialogContent'));
    }
}));
