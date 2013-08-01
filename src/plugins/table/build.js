builder.addModule({
    name: 'Table',
    type: 'plugin',
    files: [
        __dirname + '/table-cell-button.js',
        __dirname + '/table-create.js',
        __dirname + '/table-delete-column.js',
        __dirname + '/table-delete-row.js',
        __dirname + '/table-insert-column.js',
        __dirname + '/table-insert-row.js',
        __dirname + '/table-merge-cells.js',
        __dirname + '/table-split-cells.js',
        __dirname + '/table-support.js',
        __dirname + '/style/table-support.scss',
        __dirname + '/style/table.scss',
        __dirname + '/style/images/table-delete-column.png',
        __dirname + '/style/images/table-delete-row.png',
        __dirname + '/style/images/table-insert-column.png',
        __dirname + '/style/images/table-insert-row.png',
        __dirname + '/style/images/table-join.png',
        __dirname + '/style/images/table-split.png',
        __dirname + '/style/images/table.png',
        __dirname + '/templates/create-menu.html'
    ]
});