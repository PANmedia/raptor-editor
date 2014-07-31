/**
 * Link remove plugin.
 *
 * @plugin PreviewToggleButton linkRemove
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */
Raptor.registerUi(new PreviewToggleButton({
    name: 'linkRemove',
    disable: true,

    action: function() {
        this.raptor.actionApply(function() {
            document.execCommand('unlink');
        }.bind(this));
    },

    selectionToggle: function() {
        var element = selectionGetElement();
        if (!element) {
            return false;
        }
        if (element.closest('a').length) {
            return true;
        }
        return false;
    }
}));
