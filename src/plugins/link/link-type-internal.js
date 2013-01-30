
function LinkTypeInternal(raptor) {
    this.raptor = raptor;
    this.label = _('linkTypeInternalLabel');
};

LinkTypeInternal.prototype.getContent = function() {
    return this.raptor.getTemplate('link.internal', {
        baseClass: this.raptor.options.baseClass,
        domain: window.location.protocol + '//' + window.location.host + '/'
    });
};

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
