/**
 * @fileOverview
 * @author David Neilsen - david@panmedia.co.nz
 * @author Michael Robinson - michael@panmedia.co.nz
 * @version 0.1
 */

var element = {

    /**
     * Remove comments from element.
     *
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
     *
     * @param {jQuery} parent The jQuery element to cleanse of attributes.
     * @param {String[]|null} allowedAttributes An array of allowed attributes.
     * @return {jQuery} The modified parent.
     */
    removeAttributes: function(parent, allowedAttributes) {
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
    },

    /**
     * Sets the z-index CSS property on an element to 1 above all its sibling elements.
     *
     * @param {jQuery} element The jQuery element to cleanse of attributes.
     */
    bringToTop: function(element) {
        var zIndex = 1;
        element.siblings().each(function() {
            var z = $(this).css('z-index');
            if (!isNaN(z) && z > zIndex) {
                zIndex = z + 1;
            }
        });
        element.css('z-index', zIndex);
    },

    /**
     * @param  {jQuery} element The jQuery element to retrieve the outer HTML from.
     * @return {String} The outer HTML.
     */
    outerHtml: function(element) {
        return element.clone().wrap('<div/>').parent().html();
    }

};