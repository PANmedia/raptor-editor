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

var RevisionsButton = new DialogButton({
    name: 'revisionsButton',
    text: _('revisionsButton'),
    plugin: null,

    dialogOptions: {
        width: 600,
        height: 400
    },
    applyAction: function(dialog) {
        var html = this.find('.selected-revision').data('content');
        this.raptor.actionApply(function() {
            this.raptor.setHtml(html);
        }.bind(this));
    },
    openDialog: function(dialog) {
        this.raptor.fire('hideHoverPanel');
        this.plugin.getRevisions(function(result) {
            console.log(arguments);
            dialog.find('> div').text(result);
        }, function(result) {
            console.log(arguments);
            dialog.find('> div').text(result);
        });
    },
    getDialogTemplate: function() {
        return $('<div>').html(this.raptor.getTemplate('revisions.dialog', this.options));
    }
});
