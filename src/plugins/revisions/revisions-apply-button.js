/**
 * @fileOverview Contains the apply revisions button code.
 * @author  Michael Robinson <michael@panmedia.co.nz>
 * @author  David Neilsen <david@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates an instance of the apply button that applies & saves the selected revision
 *
 * @param {type} param
 */
var RevisionsApplyButton = new Button({
    name: 'revisionsApplyButton',
    title: _('revisionsApplyButtonTitle'),
    text: _('revisionsApplyButtonTitle'),

    action: function() {
        this.raptor.setHtml(this.options.revision.content);
        this.raptor.setOriginalHtml(this.raptor.getHtml());
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
    }

});

