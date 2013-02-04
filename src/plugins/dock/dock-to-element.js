Raptor.registerUi(new Button({
    name: 'dockToElement',
    action: function() {
        this.raptor.plugins.dock.toggleDockToElement();
        if (this.raptor.plugins.dock.dockState) {
            aButtonActive(this.button);
        } else {
            aButtonInactive(this.button);
        }
    }
}));
