builder.addModule({
    name: 'License',
    type: 'license',
    files: [
        __dirname + '/../TOP'
    ]
});

builder.addModule({
    name: 'Tools',
    type: 'core',
    files: [
        __dirname + '/tools/action.js',
        __dirname + '/tools/clean.js',
        __dirname + '/tools/dock.js',
        __dirname + '/tools/element.js',
        __dirname + '/tools/fragment.js',
//        __dirname + '/tools/list.js',
        __dirname + '/tools/node.js',
        __dirname + '/tools/persist.js',
        __dirname + '/tools/range.js',
        __dirname + '/tools/selection.js',
        __dirname + '/tools/state.js',
        __dirname + '/tools/string.js',
        __dirname + '/tools/style.js',
        __dirname + '/tools/table.js',
        __dirname + '/tools/template.js',
        __dirname + '/tools/types.js'
    ]
});

builder.addModule({
    name: 'Raptor',
    type: 'core',
    depends: [
        'Common',
        'Tools',
        'jQuery UI Adapter',
        'Pine Notify Adapter',
    ],
    files: [
        __dirname + '/init.js',
        __dirname + '/support.js',
        __dirname + '/raptor.js',
        __dirname + '/raptor-widget.js',

        __dirname + '/style/config.rb',
        __dirname + '/style/diagonal-lines.png',
        __dirname + '/style/raptor.scss',
        __dirname + '/style/mixins.scss',
        __dirname + '/style/style.scss',
        __dirname + '/style/support.scss',
        __dirname + '/style/variables.scss',
        __dirname + '/style/z-index.scss',

        __dirname + '/templates/unsupported.html',

        // Components
        __dirname + '/components/layout.js',
        __dirname + '/components/plugin.js',

        __dirname + '/components/layout/ui-group.js',

        __dirname + '/components/layout/toolbar.js',
        __dirname + '/components/layout/toolbar.scss',

        __dirname + '/components/layout/hover-panel.js',
        __dirname + '/components/layout/hover-panel.scss',

        __dirname + '/components/layout/element-hover-panel.js',

        __dirname + '/components/ui/button.js',
        __dirname + '/components/ui/preview-button.js',
        __dirname + '/components/ui/toggle-button.js',
        __dirname + '/components/ui/preview-toggle-button.js',
        __dirname + '/components/ui/filtered-preview-button.js',
        __dirname + '/components/ui/css-class-applier-button.js',

        __dirname + '/components/ui/dialog-button.js',
        __dirname + '/components/ui/dialog-toggle-button.js',

        __dirname + '/components/ui/menu-button.js',
        __dirname + '/components/ui/menu.js',
        __dirname + '/components/ui/custom-menu.js',
        __dirname + '/components/ui/select-menu.js',
        __dirname + '/components/ui/menu.scss',
        __dirname + '/components/ui/select-menu.scss'
    ]
});

builder.addModule({
    name: 'Expose',
    type: 'expose',
    include: [
        'preset'
    ],
    files: [
        __dirname + '/expose.js'
    ]
});
