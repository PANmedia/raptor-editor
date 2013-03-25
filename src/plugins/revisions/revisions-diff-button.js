/**
 * @fileOverview Contains the view revisions diff button code.
 * @author  Michael Robinson <michael@panmedia.co.nz>
 * @author  David Neilsen <david@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

var diffs = {};

/**
 * Creates an instance of the dialog button to open the revisions dialog.
 *
 * @param {type} param
 */
var RevisionsDiffButton = new DialogButton({
    name: 'revisionsDiffButton',
    title: _('revisionsButtonViewDiffTitle'),
    text: _('revisionsButtonViewDiffText'),

    diffTool: false,

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

    getDiffTool: function() {
        if (!this.diffTool) {
            this.diffTool = new diff_match_patch();
        }
        return this.diffTool;
    },

    /**
     * Get the diff for this button instance's revision.
     *
     * @return {String} The HTML diff
     */
    getDiff: function() {
        if (typeof diffs[this.options.revision.id] === 'undefined') {
            var diff = this.getDiffTool().diff_main(this.options.current.content, this.options.revision.content);
            this.getDiffTool().diff_cleanupSemantic(diff);
            diffs[this.options.revision.id] = this.getDiffTool().diff_prettyHtml(diff);
        }
        return diffs[this.options.revision.id];
    },

    /**
     * Fire diffView event, replace content div with the diff for this instance's
     * revision.
     *
     * @param  {Object} dialog
     */
    openDialog: function(dialog) {
        dialog.find('.' + this.options.baseClass + '-diff').html(this.getDiff());
    },

    /**
     * @return {Element}
     */
    getDialogTemplate: function() {
        return $('<div>').html(this.raptor.getTemplate('revisions.diff-dialog', this.options));
    }
});
