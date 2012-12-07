function SaveJsonPlugin(name, overrides) {
    RaptorPlugin.call(this, name || 'saveJson', overrides);
}

SaveJsonPlugin.prototype = Object.create(RaptorPlugin.prototype);

Raptor.registerPlugin(new SaveJsonPlugin());
