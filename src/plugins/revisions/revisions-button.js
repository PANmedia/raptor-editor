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
        width: 300,
        height: 400,
        modal: false
    },

    applyAction: function(dialog) {
        var html = dialog.find('.selected').data().revision.content;
        this.raptor.actionApply(function() {
            this.raptor.setHtml(html);
        }.bind(this));
    },

    openDialog: function(dialog) {

        this.raptor.enableEditing();
        this.raptor.showLayout();

        this.raptor.fire('hideHoverPanel');
        var _this = this;
        this.raptor.getPlugin('revisions').getRevisions(function(revisions) {
            var tbody = dialog.find('> div')
                            .html(this.raptor.getTemplate('revisions.table', this.options))
                            .find('tbody');
            var trTemplate = this.raptor.getTemplate('revisions.tr', this.options);
            var tableRows = [];
            for (var revisionIndex = 0; revisionIndex < revisions.length; revisionIndex++) {
                var tr = $(trTemplate);
                tr.data('revision', revisions[revisionIndex])
                    .find('.' + this.options.baseClass + '-updated')
                    .html(revisions[revisionIndex].updated);
                this.bindRow(dialog, tbody, tr);
                tableRows.push(tr);
            }
            tbody.append(tableRows);
        }.bind(this), function() {
            dialog.find('> div').text('There was a problem getting revisions for this block');
        });
    },

    applyRevision: function(revision) {
        selectionSelectInner(this.raptor.getElement().get(0));
        selectionReplace(revision.content);
        this.raptor.checkChange();
    },

    bindRow: function(dialog, tbody, tableRow) {
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

    getDialogTemplate: function() {
        return $('<div>').html(this.raptor.getTemplate('revisions.dialog', this.options));
    },

    getOkButton: function() {
        return false;
    }
});

Raptor.registerUi(RevisionsButton);
