/**
 * @fileOverview Contains the view source dialog code.
 * @author  David Neilsen <david@panmedia.co.nz>
 * @author  Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates an instance of the dialog button to open the view source dialog.
 *
 * @todo param stuffs?
 * @param {type} param
 */
Raptor.registerUi(new DialogButton({
    name: 'viewSource',
    dialogOptions: {
        width: 600,
        height: 400
    },
    applyAction: function(dialog) {
        var html = dialog.find('textarea').val();
        this.raptor.actionApply(function() {
            this.raptor.setHtml(html);
        }.bind(this));
    },
    openDialog: function(dialog) {
        dialog.find('textarea').text(this.raptor.getHtml());
    },
    getDialogTemplate: function() {
        return $('<div>').html(this.raptor.getTemplate('view-source.dialog', this.options));
    }
}));
