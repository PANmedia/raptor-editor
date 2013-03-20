/**
 * @fileOverview Contains the preview revisions button code.
 * @author  Michael Robinson <michael@panmedia.co.nz>
 * @author  David Neilsen <david@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates an instance of the preview button that applies content directly
 * to the element.
 *
 * @param {type} param
 */
var RevisionsPreviewButton = new Button({
    name: 'revisionsPreviewButton',
    title: _('revisionsPreviewButtonTitle'),
    text: _('revisionsPreviewButtonTitle'),

    init: function() {
        this.raptor.bind('revisionsPreview', function() {
            aButtonInactive(this.button);
        }.bind(this));
        return Button.prototype.init.apply(this, arguments);
    },

    action: function() {
        this.raptor.getElement().html(this.options.revision.content);
        this.raptor.fire('revisionsPreview');
        aButtonActive(this.button);
    }

});
