raptor.registerPreset('toolbar', {
    layout: {
        type: 'toolbar',
        options: {
            uiOrder: null
        }
    }
});

$.extend(raptor.defaults, raptor.presets.toolbar);
