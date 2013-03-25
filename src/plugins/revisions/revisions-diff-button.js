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
    title: _('revisionsButtonViewDiffTitle'),
    text: _('revisionsButtonViewDiffText'),

    dialogOptions: {
        width: 400,
        height: 400,
        modal: false
    },

    /**
     * Bind to the diffView event so this button can be deactived when
     * another one is clicked.
     *
     * @return {RevisionsDiffButton}
     */
    init: function() {
        // this.raptor.bind('diffView', function() {
        //     aButtonInactive(this.button);
        // }.bind(this));
        return DialogButton.prototype.init.apply(this, arguments);
    },

    action: function() {
        var dialog = this.getDialog(this);
        this.openDialog(dialog);
        aDialogOpen(dialog);
    },

    /**
     * Disable the apply action
     *
     * @param  {Element} dialog
     */
    applyAction: function(dialog) { },

    /**
     * Disable the OK button
     *
     * @param  {String} name
     */
    getOkButton: function(name) {
        return false;
    },

    /**
     * Fire diffView event, replace content div with the diff for this instance's
     * revision.
     *
     * @param  {Object} dialog
     */
    openDialog: function(dialog) {
        // this.raptor.fire('diffView');
        // aButtonActive(this.button);
        dialog.find('.' + this.options.baseClass + '-diff').html(this.options.revision.diff);
    },

    /**
     * @return {Element}
     */
    getDialogTemplate: function() {
        return $('<div>').html(this.raptor.getTemplate('revisions.diff-dialog', this.options));
    }
});
