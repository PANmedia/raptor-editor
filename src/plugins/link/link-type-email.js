
function LinkTypeEmail(raptor) {
    this.raptor = raptor;
    this.label = _('linkTypeEmailLabel');
}

LinkTypeEmail.prototype.getContent = function() {
    return this.raptor.getTemplate('link.email', this.options);
};

LinkTypeEmail.prototype.getAttributes = function(panel) {
    var address = panel.find('[name=email]').val(),
        subject = panel.find('[name=subject]').val();
    if ($.trim(subject)) {
        subject = '?Subject=' + subject;
    }
    return {
        href: 'mailto:' + address + subject
    };
};
