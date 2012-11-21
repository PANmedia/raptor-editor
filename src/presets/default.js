Raptor.registerPreset('toolbar', {
    layout: {
        type: 'toolbar',
        options: {
            uiOrder: null
        }
    }
});

$.extend(Raptor.defaults, Raptor.presets.toolbar);
