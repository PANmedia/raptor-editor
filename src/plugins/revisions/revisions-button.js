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
            trTemplate = this.raptor.getTemplate('revisions.tr', this.options),
            tableRows = [],
            updatedDate = null;

        for (var revisionIndex = 0; revisionIndex < revisions.length; revisionIndex++) {
            var tr = $(trTemplate);

            updatedDate = new Date(revisions[revisionIndex].updated);

            tr.data('revision', revisions[revisionIndex])
                .find('.' + this.options.baseClass + '-updated')
                .html(updatedDate.toLocaleString());

            if (hasDiff) {
                var button = $.extend({}, RevisionsDiffButton);
                button.raptor = this.raptor;
                button.diff = revisions[revisionIndex].diff;
                button.options = this.options;
                tr.find('.' + this.options.baseClass + '-view-diff')
                    .html(button.init());
            }
            this.bindRevision(this.dialog, tbody, tr);
            tableRows.push(tr);
        }
        tbody.append(tableRows, hasDiff);
        if (hasDiff) {
            tbody.parent('table').find('th, td').show();
        }
    },

    /**
     * Display a generic error message
     */
    displayAjaxError: function() {
        this.dialog.find('> div')
            .text(_('viewRevisionsAJAXFailed'));
    },

    /**
     * Apply the given revision to the current Raptor instance.
     *
     * @param  {Object} revision
     */
    applyRevision: function(revision) {
        selectionSelectInner(this.raptor.getElement().get(0));
        selectionReplace(revision.content);
        this.raptor.checkChange();
    },

    /**
     * Bind events to the given tableRow to allow user interaction.
     *
     * @param  {Object} dialog
     * @param  {Element} tbody The revisions table's tbody Element
     * @param  {Element} tableRow The revision's tr Element
     */
    bindRevision: function(dialog, tbody, tableRow) {
        var revision = tableRow.data().revision,
            applied = false;
            updatedCell = tableRow.find('.' + this.options.baseClass + '-updated');

        updatedCell.mouseenter(function() {
            applied = false;
            tableRow.addClass('ui-state-hover');
            this.raptor.actionPreview(function() {
                this.applyRevision(revision);
            }.bind(this));
        }.bind(this));

        updatedCell.mouseleave(function() {
            tableRow.removeClass('ui-state-hover');
            if (applied) {
                return true;
            }
            this.raptor.actionPreviewRestore();
        }.bind(this));

        updatedCell.click(function() {
            tbody.find('.selected').removeClass('selected');
            tableRow.addClass('selected');
            applied = true;
            aDialogClose(dialog);
            this.applyAction(dialog);
        }.bind(this));
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
