/**
 * @fileOverview Contains the apply revisions button code.
 * @license http://www.raptor-editor.com/license
 *
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates an instance of the apply button that applies & saves the selected revision
 */
var RevisionsApplyButton = new DialogButton({
    name: 'revisionsApplyButton',
    title: _('revisionsApplyButtonTitle'),
    text: _('revisionsApplyButtonTitle'),

    action: function() {
        var dialog = this.getDialog(this);
        this.openDialog(dialog);
        aDialogOpen(dialog);
    },

    /**
     * @param  {Element} dialog
     */
    applyAction: function(dialog) {
        this.raptor.setHtml(this.options.revision.content);
        this.getSavePlugin().save();
    },

    getSavePlugin: function() {
        var plugin = this.raptor.getPlugin(this.options.savePlugin);
        // <strict>
        if (!plugin) {
            handlerError('Revision plugin requires a save plugin to be defined & present');
        }
        // </strict>
        return plugin;
    },

    /**
     * @return {Element}
     */
    getDialogTemplate: function() {
        return $('<div>').html(this.raptor.getTemplate('revisions.apply-dialog', this.options));
    }
});
