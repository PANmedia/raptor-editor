/**
 * @fileOverview Contains the view source dialog code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates an instance of the dialog button to open the view source dialog.
 */
Raptor.registerUi(new DialogButton({
    name: 'viewSource',
    dialogOptions: {
        width: 600,
        height: 400
    },

    /**
     * Replace the editing element's content with the HTML from the dialog's textarea
     *
     * @param  {Element} dialog
     */
    applyAction: function(dialog) {
        var html = dialog.find('textarea').val();
        this.raptor.actionApply(function() {
            this.raptor.setHtml(html);
        }.bind(this));
    },

    /**
     * Update the dialog's text area with the current HTML.
     *
     * @param  {Element} dialog
     */
    openDialog: function(dialog) {
        dialog.find('textarea').val(this.raptor.getHtml());
    },

    /**
     * @return {Element}
     */
    getDialogTemplate: function() {
        return $('<div>').html(this.raptor.getTemplate('view-source.dialog', this.options));
    }
}));
