Raptor.registerUi(new Button({
    name: 'linkRemove',

    action: function() {
        this.raptor.actionApply(function() {
            var applier = rangy.createApplier({
                tag: 'a'
            });
            applier.undoToSelection();
        });
    },
}));
