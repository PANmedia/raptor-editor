/**
 * @fileOverview Contains the internal link class code.
 * @author  David Neilsen <david@panmedia.co.nz>
 * @author  Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * @class The internal link class.
 * @constructor
 *
 * @todo check please
 * @param {Object} raptor
 * @returns {Element}
 */
function LinkTypeInternal(raptor) {
    this.raptor = raptor;
    this.label = _('linkTypeInternalLabel');
}

/**
 * Gets the content of the internal link.
 *
 * @returns {Element}
 */
LinkTypeInternal.prototype.getContent = function() {
    return this.raptor.getTemplate('link.internal', {
        baseClass: this.raptor.options.baseClass,
        domain: window.location.protocol + '//' + window.location.host
    });
};

/**
 * Gets the attributes of the internal link.
 *
 * @todo type and des for panel and return
 * @param {type} panel
 * @returns {LinkTypeInternal.prototype.getAttributes.result}
 */
LinkTypeInternal.prototype.getAttributes = function(panel) {
    var address = panel.find('[name=location]').val(),
        target = panel.find('[name=blank]').is(':checked'),
        result = {
            href: address
        };

    if (target) {
        result.target = '_blank';
    }

    return result;
};

/**
 * Updates the users inputs.
 *
 * @todo type and des for panel and des for return.
 * @param {String} link The internal lnk.
 * @param {type} panel
 * @returns {Boolean}
 */
LinkTypeInternal.prototype.updateInputs = function(link, panel) {
    var href = link.attr('href');
    if (href.indexOf('http://') === -1 &&
            href.indexOf('mailto:') === -1) {
        panel.find('[name=location]').val(href);
    } else {
        panel.find('[name=location]').val('');
    }
    if (link.attr('target') === '_blank') {
        panel.find('[name=blank]').prop('checked', true);
    } else {
        panel.find('[name=blank]').prop('checked', false);
    }
    return false;
};
