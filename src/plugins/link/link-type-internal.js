/**
 * @fileOverview Contains the internal link class code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
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
function LinkTypeInternal(linkCreate) {
    this.linkCreate = linkCreate;
    this.label = tr('linkTypeInternalLabel');
}

/**
 * Gets the content of the internal link.
 *
 * @returns {Element}
 */
LinkTypeInternal.prototype.getContent = function() {
    return this.linkCreate.raptor.getTemplate('link.internal', {
        baseClass: this.linkCreate.raptor.options.baseClass,
        domain: window.location.protocol + '//' + window.location.host
    });
};

/**
 * Gets the attributes of the internal link.
 *
 * @todo type and des for panel and return
 * @param {Element} panel
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

LinkTypeInternal.prototype.resetInputs = function(panel) {
    panel.find('[name=location]').val('');
    panel.find('[name=blank]').prop('checked', false);
};

/**
 * Updates the users inputs.
 *
 * @todo type and des for panel and des for return.
 * @param {String} link The internal lnk.
 * @param {Element} panel
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
