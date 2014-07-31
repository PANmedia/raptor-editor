/**
 * @fileOverview Contains the document link class code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * @class The internal link class.
 *
 * @constructor
 * @param {Raptor} raptor
 */
function LinkTypeDocument(linkCreate) {
    this.linkCreate = linkCreate;
    this.label = tr('linkTypeDocumentLabel');
}

LinkTypeDocument.prototype = Object.create(LinkTypeExternal.prototype);

LinkTypeDocument.prototype.resetInputs = function(panel) {
    panel.find('[name=location]').val('http://');
    panel.find('[name=blank]').prop('checked', false);
};

/**
 * @return {String} The document link panel content.
 */
LinkTypeDocument.prototype.getContent = function() {
    return this.linkCreate.raptor.getTemplate('link.document', this.linkCreate.raptor.options);
};
