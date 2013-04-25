/**
 * @fileOverview Contains the float none button class code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates an instance of a filtered preview button to remove the float an image.
 *
 * @todo des and type for the param.
 * @param {type} param
 */
Raptor.registerUi(new FilteredPreviewButton({
    name: 'floatNone',
    applyToElement: function(element) {
        element.removeClass(this.options.cssPrefix + 'float-right');
        element.removeClass(this.options.cssPrefix + 'float-left');
        cleanEmptyAttributes(element, ['class']);
    },
    getElement: function(range) {
        var images = $(range.commonAncestorContainer).find('img');
        return images.length ? images : null;
    }
}));
