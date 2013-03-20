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

    dialogOptions: {
        width: 650,
        height: 400,
        modal: false
    },

    /**
     * Get and either render the revisions for this instance, or
     * display an appropriate error message.
     *
     * @param  {Object} dialog
     */
    openDialog: function(dialog) {

        this.raptor.bind('saved', function() {
            aDialogClose(dialog);
        });

        this.dialog = dialog;
        this.state = this.raptor.stateSave();
        this.raptor.getPlugin('revisions')
            .getRevisions(this.renderRevisions.bind(this), this.displayAjaxError.bind(this));
    },

    /**
     * Render revisions into a table.
     * Calls bindRow to bind events to each row.
     *
     * @param  {Object[]} revisions
     */
    renderRevisions: function(revisions, hasDiff) {

        var tbody = this.dialog.find('> div')
                        .html(this.raptor.getTemplate('revisions.table', this.options))
                        .find('tbody'),
            tableRowTemplate = this.raptor.getTemplate('revisions.tr', this.options),
            tableRows = [],
            tableRow = null,
            updatedDate = null,
            controls = null,
            revision = null;

        for (var revisionIndex = 0; revisionIndex < revisions.length; revisionIndex++) {
            tableRow = $(tableRowTemplate);
            revision = revisions[revisionIndex];

            updatedDate = new Date(revision.updated);

            tableRow.data('revision', revision)
                .find('.' + this.options.baseClass + '-updated')
                .html(updatedDate.toLocaleString());

            controls = tableRow.find('.' + this.options.baseClass + '-controls');

            controls.append(this.prepareRowButton('preview', revision, RevisionsPreviewButton));
            controls.append(this.prepareRowButton('apply', revision, RevisionsApplyButton));
            if (hasDiff) {
                controls.append(this.prepareRowButton('diff', revision, RevisionsDiffButton));
            }
            tableRows.push(tableRow);
        }

        tbody.append(tableRows);
    },

    prepareRowButton: function(name, revision, buttonObject) {
        var button = $.extend({}, buttonObject);
        button.raptor = this.raptor;
        button.options = $.extend({}, this.options, {
            baseClass: this.options.baseClass + '-' + name + '-button',
            revision: revision
        });
        return button.init();
    },

    /**
     * Display a generic error message
     */
    displayAjaxError: function() {
        this.dialog.find('> div')
            .text(_('viewRevisionsAJAXFailed'));
    },

    /**
     * @return {Element}
     */
    getDialogTemplate: function() {
        return $('<div>').html(this.raptor.getTemplate('revisions.dialog', this.options));
    },

    /**
     * Disable the OK button, as clicking a revision will apply & close the dialog.
     *
     * @return {Boolean} False to disable the OK button
     */
    getOkButton: function() {
        return false;
    }
});

// Also register this button for use in the layout
Raptor.registerUi(RevisionsButton);
