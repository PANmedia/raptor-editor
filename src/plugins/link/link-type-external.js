
function LinkTypeExternal(raptor) {
    this.raptor = raptor;
    this.label = _('linkTypeExternalLabel');
};

LinkTypeExternal.prototype.getContent = function() {
    return this.raptor.getTemplate('link.external', this.raptor.options);
};

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
