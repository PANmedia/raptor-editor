/**
 * @fileOverview Contains the image swap button code.
 * @author David Neilsen <david@panmedia.co.nz>
 */
Raptor.registerUi(new Button({
    name: 'imageSwap',
    chooser: null,
    click: function() {
        selectionSelectOuter(this.layout.target);
        this.raptor.getPlugin(this.options.chooser).action(this.layout.target);
    }
}));
