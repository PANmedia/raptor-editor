/**
 * @fileOverview
 * @author David Neilsen - david@panmedia.co.nz
 * @author Michael Robinson - michael@panmedia.co.nz
 * @version 0.1
 */

var element = {

    /**
     * Remove comments from element.
     * @param  {jQuery} parent The jQuery element to have comments removed from.
     * @return {jQuery} The modified parent.
     */
    removeComments: function(parent) {
        parent.contents().each(function() {
            if (this.nodeType == 8) {
                $(this).remove()
            }
        });
        parent.children().each(function() {
            element.removeComments($(this));
        });
        return parent;
    },

    /**
     * Remove all but the allowed attributes from the parent.
     * @param {jQuery} parent The jQuery element to cleanse of attributes.
     * @param {Array|null} allowedAttributes An array of allowed attributes. Leave null for default ['href']
     * @return{jQuery} The modified parent.
     */
    removeAttributes: function(parent, allowedAttributes) {
        allowedAttributes = allowedAttributes || ['href'];
        parent.children().each(function() {
            var stripAttributes = $.map(this.attributes, function(item) {
                if ($.inArray(item.name, allowedAttributes) === -1) {
                    return item.name;
                }
            });
            var child = $(this);
            $.each(stripAttributes, function(i, attributeName) {
                child.removeAttr(attributeName);
            });
            element.removeAttributes($(this), allowedAttributes);
        });
        return parent;
    }
};