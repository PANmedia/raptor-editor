/**
 * @fileOverview Contains the external link class code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * @class The external link class.
 * @constructor
 *
 * @todo check please
 * @param {Object} raptor
 * @returns {Element}
 */
function LinkTypeExternal(linkCreate) {
    this.linkCreate = linkCreate;
    this.label = tr('linkTypeExternalLabel');
}

/**
 * Gets the content of the external link.
 *
 * @returns {Element}
 */
LinkTypeExternal.prototype.getContent = function() {
    return this.linkCreate.raptor.getTemplate('link.external', this.linkCreate.raptor.options);
};

/**
 * Gets the attributes of the external link.
 *
 * @param {Element} panel
 * @returns {LinkTypeExternal.prototype.getAttributes.result|Boolean}
 */
LinkTypeExternal.prototype.getAttributes = function(panel) {
    var address = panel.find('[name=location]').val(),
        target = panel.find('[name=blank]').is(':checked'),
        result = {
            href: address
        };

    if (target) {
        result.target = '_blank';
    }

    if ($.trim(result.href) === 'http://') {
        return false;
    }

    return result;
};

LinkTypeExternal.prototype.resetInputs = function(panel) {
    panel.find('[name=location]').val('http://');
    panel.find('[name=blank]').prop('checked', true);
};

/**
 * Updates the users inputs.
 *
 * @param {String} link The external link.
 * @param {Element} panel
 * @returns {Boolean}
 */
LinkTypeExternal.prototype.updateInputs = function(link, panel) {
    var result = false,
        href = link.attr('href');
    if (href.indexOf('http://') === 0) {
        panel.find('[name=location]').val(href);
        result = true;
    } else {
        panel.find('[name=location]').val('http://');
    }
    if (link.attr('target') === '_blank') {
        panel.find('[name=blank]').prop('checked', true);
    } else {
        panel.find('[name=blank]').prop('checked', false);
    }
    return result;
};
