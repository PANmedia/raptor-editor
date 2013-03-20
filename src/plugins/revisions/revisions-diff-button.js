/**
 * @fileOverview Contains the view revisions button code.
 * @author  Michael Robinson <michael@panmedia.co.nz>
 * @author  David Neilsen <david@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates an instance of the dialog button to open the revisions dialog.
 *
 * @param {type} param
 */
var RevisionsDiffButton = new DialogButton({
    name: 'revisionsDiffButton',
    title: _('revisionsButtonViewDiff'),

    dialogOptions: {
        width: 400,
        height: 400,
        modal: false
    },

    diff: null,

    /**
     * @param  {Object} dialog
     */
    applyAction: function(dialog) {
        var html = dialog.find('.' + this.options.baseClass + '-diff').html();
        this.raptor.actionApply(function() {
            this.raptor.setHtml(html);
        }.bind(this));
    },

    /**
     * Get and either render the revisions for this instance, or
     * display an appropriate error message.
     *
     * @param  {Object} dialog
     */
    openDialog: function(dialog) {
        dialog.find('.' + this.options.baseClass + '-diff').html(this.diff);
    },

    /**
     * @return {Element}
     */
    getDialogTemplate: function() {
        return $('<div>').html(this.raptor.getTemplate('revisions.diff-dialog', this.options));
    }
});
