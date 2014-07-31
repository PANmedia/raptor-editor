/**
 * @fileOverview Contains the internal link class code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * @class Email link class.
 * @constructor
 *
 * @todo param details and des for return.
 * @param {type} raptor
 * @returns {LinkTypeEmail}
 */
function LinkTypeEmail(linkCreate) {
    this.linkCreate = linkCreate;
    this.label = tr('linkTypeEmailLabel');
}

/**
 * Gets the content of the email link.
 *
 * @returns {Element}
 */
LinkTypeEmail.prototype.getContent = function() {
    return this.linkCreate.raptor.getTemplate('link.email', this.linkCreate.raptor.options);
};

/**
 * Gets the attributes of the email link.
 *
 * @param {Element} panel
 * @returns {LinkTypeEmail.prototype.getAttributes.Anonym$0|Boolean}
 */
LinkTypeEmail.prototype.getAttributes = function(panel) {
    var address = panel.find('[name=email]').val(),
        subject = panel.find('[name=subject]').val();
    if ($.trim(subject)) {
        subject = '?Subject=' + encodeURIComponent(subject);
    }
    if ($.trim(address) === '') {
        return false;
    }
    return {
        href: 'mailto:' + address + subject
    };
};

LinkTypeEmail.prototype.resetInputs = function(panel) {
    panel.find('[name=email]').val('');
    panel.find('[name=subject]').val('');
};

/**
 * Updates the users inputs.
 *
 * @param {String} link The email link.
 * @param {Element} panel
 * @returns {Boolean}
 */
LinkTypeEmail.prototype.updateInputs = function(link, panel) {
    var result = false;
        email = '',
        subject = '',
        href = link.attr('href');
    if (href.indexOf('mailto:') === 0) {
        var subjectPosition = href.indexOf('?Subject=');
        if (subjectPosition > 0) {
            email = href.substring(7, subjectPosition);
            subject = href.substring(subjectPosition + 9);
        } else {
            email = href.substring(7);
            subject = '';
        }
        result = true;
    }
    panel.find('[name=email]').val(email);
    panel.find('[name=subject]').val(subject);
    return result;
};
