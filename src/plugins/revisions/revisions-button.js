/**
 * @fileOverview Contains the view revisions button code.
 * @license http://www.raptor-editor.com/license
 *
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates an instance of the dialog button to open the revisions dialog.
 */
Raptor.registerUi(new DialogButton({
    name: 'revisions',
    text: _('revisionsText'),

    dialogOptions: {
        width: 650,
        height: 400,
        modal: false
    },

    init: function() {
            var result = DialogButton.prototype.init.call(this);
        if (typeof this.raptor.getPlugin('revisions') === 'undefined' ||
                typeof this.raptor.getPlugin('revisions').getUrl() === 'undefined') {
            aButtonSetLabel(this.button, _('revisionsTextEmpty'))
            aButtonDisable(this.button)
        }
        return result;
    },

    /**
     * Get and either render the revisions for this instance, or
     * display an appropriate error message.
     *
     * @param  {Object} dialog
     */
    openDialog: function() {
        var loadingMessage = $('<p/>')
                .html(_('revisionsLoading'))
                .addClass(this.options.baseClass + '-loading-revisions');

        this.getDialogContentArea().html(loadingMessage);

        this.state = this.raptor.stateSave();
        this.raptor.getElement().removeClass(this.raptor.options.baseClass + '-editable-hover');
        this.raptor.getElement().addClass(this.options.baseClass + '-reviewing');
        this.raptor.getPlugin('revisions')
            .getRevisions(this.renderRevisions.bind(this), this.displayAjaxError.bind(this));
        DialogButton.prototype.openDialog.call(this);
    },

    closeDialog: function() {
        // Ensure raptor's previous state is *not* restored
        this.state = null;
        this.raptor.getElement().removeClass(this.options.baseClass + '-reviewing');
        DialogButton.prototype.closeDialog.call(this);
    },

    /**
     * Return the dialog's content element.
     *
     * @return {Element}
     */
    getDialogContentArea: function() {
        return this.getDialog().find('> div');
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

        var tbody = this.getDialogContentArea()
                .html(this.raptor.getTemplate('revisions.table', this.options))
                .find('tbody'),
            tableRowTemplate = this.raptor.getTemplate('revisions.tr', this.options),
            tableRows = [],
            tableRow = null,
            controls = null,
            revision = null;

        var currentRow = $(tableRowTemplate).find('.' + this.options.baseClass + '-updated')
            .html((new Date(parseInt(data.current.updated))).toLocaleString())
            .next().html(_('revisionsButtonCurrent'))
            .parent().addClass(this.options.baseClass + '-current ui-state-highlight');

        tableRows.push(currentRow);

        for (var revisionIndex = 0; revisionIndex < revisions.length; revisionIndex++) {
            tableRow = $(tableRowTemplate);
            revision = revisions[revisionIndex];
            tableRow.data('revision', revision)
                .find('.' + this.options.baseClass + '-updated')
                .html((new Date(parseInt(revision.updated))).toLocaleString());

            controls = tableRow.find('.' + this.options.baseClass + '-controls');

            controls.append(this.prepareRowButton('preview', revision, data.current, RevisionsPreviewButton));
            controls.append(this.prepareRowButton('apply', revision, data.current, RevisionsApplyButton));
            controls.append(this.prepareRowButton('diff', revision, data.current, RevisionsDiffButton));

            tableRows.push(tableRow);
        }
        tbody.append(tableRows);
    },

    /**
     * Prepare a single row button.
     *
     * @param  {String} name
     * @param  {Object} revision The revision represented by this row
     * @param  {Object} current The current revision
     * @param  {Button} buttonObject
     * @return {Element} The button
     */
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
        this.getDialogContentArea().text(_('revisionsAJAXFailed'));
    },

    /**
     * Display 'no revisions' message';
     * @return {[type]} [description]
     */
    displayNoRevisions: function() {
        this.getDialogContentArea().text(_('revisionsNone'));
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

}));
