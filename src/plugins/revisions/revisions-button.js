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
    renderRevisions: function(data) {

        if (typeof data.revisions === 'undefined' || !data.revisions.length) {
            this.displayNoRevisions();
            return;
        }

        var revisions = data.revisions;

        var tbody = this.dialog.find('> div')
                        .html(this.raptor.getTemplate('revisions.table', this.options))
                        .find('tbody'),
            tableRowTemplate = this.raptor.getTemplate('revisions.tr', this.options),
            tableRows = [],
            tableRow = null,
            controls = null,
            revision = null;

        var currentRow = $(tableRowTemplate).find('.' + this.options.baseClass + '-updated')
            .html((new Date(data.current.updated)).toLocaleString())
            .next().html(_('revisionsButtonCurrent'))
            .parent().addClass(this.options.baseClass + '-current ui-state-highlight');

        tableRows.push(currentRow);

        for (var revisionIndex = 0; revisionIndex < revisions.length; revisionIndex++) {
            tableRow = $(tableRowTemplate);
            revision = revisions[revisionIndex];

            tableRow.data('revision', revision)
                .find('.' + this.options.baseClass + '-updated')
                .html((new Date(revision.updated)).toLocaleString());

            controls = tableRow.find('.' + this.options.baseClass + '-controls');

            controls.append(this.prepareRowButton('preview', revision, data.current, RevisionsPreviewButton));
            controls.append(this.prepareRowButton('apply', revision, data.current, RevisionsApplyButton));
            controls.append(this.prepareRowButton('diff', revision, data.current, RevisionsDiffButton));

            tableRows.push(tableRow);
        }
        tbody.append(tableRows);
    },

    prepareRowButton: function(name, revision, current, buttonObject) {
        var button = $.extend({}, buttonObject);
        button.raptor = this.raptor;
        button.options = $.extend({}, this.options, {
            baseClass: this.options.baseClass + '-' + name + '-button',
            revision: revision,
            current: current
        });
        return button.init();
    },

    /**
     * Display a generic error message
     */
    displayAjaxError: function() {
        this.dialog.find('> div')
            .text(_('revisionsAJAXFailed'));
    },

    displayNoRevisions: function() {
        this.dialog.find('> div')
            .text(_('revisionsNone'));
    },

    /**
     * @return {Element}
     */
    getDialogTemplate: function() {
        return $('<div>').html(this.raptor.getTemplate('revisions.dialog', this.options));
    },

    /**
     * @return {Boolean} False to disable the OK button
     */
    getOkButton: function() {
        return false;
    }
});
