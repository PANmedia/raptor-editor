Raptor.registerUi(new Button({
    name: 'dockToScreen',
    action: function() {
        this.raptor.plugins.dock.toggleDockToScreen();
        if (this.raptor.plugins.dock.dockState) {
            aButtonActive(this.button);
        } else {
            aButtonInactive(this.button);
        }
    }
}));
