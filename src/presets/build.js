builder.addModule({
    name: 'Presets',
    type: 'preset',
    depends: [
        'Raptor'
    ],
    files: [
        __dirname + '/base.js',
        __dirname + '/full.js',
        __dirname + '/micro.js',
        __dirname + '/inline.js'
    ]
});
