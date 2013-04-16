function RaptorLayout(name) {
    this.name = name;
}

RaptorLayout.prototype.init = function() {
    this.raptor.bind('ready', this.ready.bind(this));
    this.raptor.bind('enabled', this.enabled.bind(this));
    this.raptor.bind('disabled', this.disabled.bind(this));
};

RaptorLayout.prototype.ready = function() {
};

RaptorLayout.prototype.enabled = function() {
};

RaptorLayout.prototype.disabled = function() {
};
