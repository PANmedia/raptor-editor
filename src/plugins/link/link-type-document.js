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
function LinkTypeDocument(raptor) {
    this.raptor = raptor;
    this.label = _('linkTypeDocumentLabel');
}

LinkTypeDocument.prototype = Object.create(LinkTypeExternal.prototype);

/**
 * @return {String} The document link panel content.
 */
LinkTypeDocument.prototype.getContent = function() {
    return this.raptor.getTemplate('link.document', this.raptor.options);
};
