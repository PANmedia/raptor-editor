builder.addModule({
    name: 'Text Align',
    type: 'plugin',
    files: [
        __dirname + '/text-align-button.js',
        
        __dirname + '/center.js',
        __dirname + '/justify.js',
        __dirname + '/left.js',
        __dirname + '/right.js',
        __dirname + '/style/text-align-front-end.scss',
        __dirname + '/style/text-align.scss',
        __dirname + '/style/images/edit-alignment-center.png',
        __dirname + '/style/images/edit-alignment-justify.png',
        __dirname + '/style/images/edit-alignment-right.png',
        __dirname + '/style/images/edit-alignment.png'
    ]
});