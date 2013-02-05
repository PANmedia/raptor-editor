function LinkTypeDocument(raptor) {
    this.raptor = raptor;
    this.label = _('linkTypeDocumentLabel');
};

LinkTypeDocument.prototype = Object.create(LinkTypeExternal.prototype);

LinkTypeDocument.prototype.getContent = function() {
    return this.raptor.getTemplate('link.document', this.raptor.options);
};
