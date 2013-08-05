builder.addModule({
    name: 'Cancel',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Button to prompt the user to disable editing and revert all changes back to their original state.',
    files: [
        __dirname + '/cancel.js',
        __dirname + '/cancel.scss',
        __dirname + '/cross.png'
    ]
});

builder.addModule({
    name: 'Class Menu',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Drop down menu to allow selecting a class to be applied to a block level element.',
    files: [
        __dirname + '/class-menu.js',
        __dirname + '/class-menu.scss',
        __dirname + '/palette-paint-brush.png',
        __dirname + '/templates/item.html'
    ]
});

builder.addModule({
    name: 'Clear Formatting',
    type: 'plugin',
    group: 'Text styling',
    description: 'Button that removes all formatting from the selected text.',
    files: [
        __dirname + '/clear-formatting.js',
        __dirname + '/clear-formatting.png',
        __dirname + '/clear-formatting.scss'
    ]
});

builder.addModule({
    name: 'Click Button To Edit',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Button that appears over an editable block when the mouse hovers it that when clicked enables Raptor.',
    files: [
        __dirname + '/click-button-to-edit.js',
        __dirname + '/click-button-to-edit.scss',
        __dirname + '/pencil.png',
        __dirname + '/templates/button.html'
    ]
});

builder.addModule({
    name: 'Color Menu Basic',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Drop down menu to allow changing text color.',
    files: [
        __dirname + '/color-menu-basic-front-end.scss',
        __dirname + '/color-menu-basic.js',
        __dirname + '/color-menu-basic.scss',
        __dirname + '/templates/menu.html'
    ]
});

builder.addModule({
    name: 'Dock',
    type: 'plugin',
    group: 'Other plugins',
    files: [
        __dirname + '/dock-plugin.js',
        __dirname + '/dock.scss'
    ]
});

builder.addModule({
    name: 'Dock to Screen',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Enables Raptor to be able to be docked to the top of the browser window.',
    depends: [
        'Dock',
    ],
    files: [
        __dirname + '/application-dock-090.png',
        __dirname + '/dock-to-screen.js',
        __dirname + '/dock-to-screen.scss',
    ]
});

builder.addModule({
    name: 'Dock to Element',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Enables Raptor to be able to be docked to an element, such as for making rich text comment forms.',
    depends: [
        'Dock',
    ],
    files: [
        __dirname + '/application-dock-tab.png',
        __dirname + '/dock-to-element.js',
        __dirname + '/dock-to-element.scss',
    ]
});


builder.addModule({
    name: 'Embed',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Allows embedding of video, flash, and other widgets.',
    files: [
        __dirname + '/embed.js',
        __dirname + '/embed.scss',
        __dirname + '/youtube.png',
        __dirname + '/templates/dialog.html'
    ]
});

builder.addModule({
    name: 'Float',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Allows aligning (floating) images.',
    files: [
        __dirname + '/edit-image-none.png',
        __dirname + '/edit-image-right.png',
        __dirname + '/edit-image.png',
        __dirname + '/float-front-end.scss',
        __dirname + '/float-left.js',
        __dirname + '/float-none.js',
        __dirname + '/float-right.js',
        __dirname + '/float.scss'
    ]
});

builder.addModule({
    name: 'Guides',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Toggle guides (outlines) around block elements inside an editable region.',
    files: [
        __dirname + '/guide.png',
        __dirname + '/guides.js',
        __dirname + '/guides.scss'
    ]
});

builder.addModule({
    name: 'History',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Adds undo and redo buttons.',
    files: [
        __dirname + '/arrow-curve-180-left.png',
        __dirname + '/arrow-curve.png',
        __dirname + '/history-redo.js',
        __dirname + '/history-undo.js',
        __dirname + '/history.scss'
    ]
});

builder.addModule({
    name: 'Hr',
    type: 'plugin',
    group: 'Text styling',
    description: 'Button to insert horizontal rule elements',
    files: [
        __dirname + '/edit-rule.png',
        __dirname + '/hr-create.js',
        __dirname + '/hr.scss'
    ]
});

builder.addModule({
    name: 'Image Resize Button',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Allows resizing images by hovering over them and clicking a button to open a resize dialog.',
    files: [
        __dirname + '/image-resize-button.js',
        __dirname + '/image-resize-button.scss',
        __dirname + '/image-resize.png',
        __dirname + '/templates/button.html',
        __dirname + '/templates/dialog.html'
    ]
});

builder.addModule({
    name: 'Insert File',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Allows simple insertion of images etc.',
    files: [
        __dirname + '/image.png',
        __dirname + '/insert-file.js',
        __dirname + '/insert-file.scss',
        __dirname + '/templates/dialog.html'
    ]
});

builder.addModule({
    name: 'Language Menu',
    type: 'plugin',
    group: 'Other plugins',
    files: [
        __dirname + '/language-menu.js',
        __dirname + '/language-menu.scss',
        __dirname + '/flags/de.png',
        __dirname + '/flags/en.png',
        __dirname + '/flags/es.png',
        __dirname + '/flags/fr.png',
        __dirname + '/flags/nl.png',
        __dirname + '/flags/ru.png',
        __dirname + '/flags/sv.png',
        __dirname + '/flags/zh-CN.png',
        __dirname + '/templates/item.html'
    ]
});

builder.addModule({
    name: 'Link',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Allows links to be creates and removed including email, internal, external and file/document links.',
    files: [
        __dirname + '/chain-unchain.png',
        __dirname + '/chain.png',
        __dirname + '/link-create.js',
        __dirname + '/link-remove.js',
        __dirname + '/link-type-document.js',
        __dirname + '/link-type-email.js',
        __dirname + '/link-type-external.js',
        __dirname + '/link-type-internal.js',
        __dirname + '/link.scss',
        __dirname + '/templates/dialog.html',
        __dirname + '/templates/document.html',
        __dirname + '/templates/email.html',
        __dirname + '/templates/error.html',
        __dirname + '/templates/external.html',
        __dirname + '/templates/file-url.html',
        __dirname + '/templates/internal.html',
        __dirname + '/templates/label.html'
    ]
});

builder.addModule({
    name: 'List',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Allows orders and unordered lists to be inserted.',
    files: [
        __dirname + '/edit-list-order.png',
        __dirname + '/edit-list.png',
        __dirname + '/list-ordered.js',
        __dirname + '/list-unordered.js',
        __dirname + '/list.scss'
    ]
});

builder.addModule({
    name: 'Logo',
    type: 'plugin',
    group: 'Other plugins',
    files: [
        __dirname + '/logo.js',
        __dirname + '/logo.scss',
        __dirname + '/raptor.png'
    ]
});

builder.addModule({
    name: 'No Break',
    type: 'plugin',
    group: 'Other plugins',
    files: [
        __dirname + '/no-break.js'
    ]
});

builder.addModule({
    name: 'Normalise Line Breaks',
    type: 'plugin',
    group: 'Other plugins',
    files: [
        __dirname + '/normalise-line-breaks.js'
    ]
});

builder.addModule({
    name: 'Paste',
    type: 'plugin',
    description: 'Enables triggering a dialog input on a paste event to clean pasted content.',
    files: [
        __dirname + '/paste.js',
        __dirname + '/paste.scss',
        __dirname + '/templates/dialog.html'
    ]
});

builder.addModule({
    name: 'Placeholder',
    type: 'plugin',
    group: 'Other plugins',
    files: [
        __dirname + '/placeholder.js'
    ]
});

builder.addModule({
    name: 'Save',
    type: 'plugin',
    group: 'Other plugins',
    files: [
        __dirname + '/disk-black.png',
        __dirname + '/save.js',
        __dirname + '/save.scss'
    ]
});

builder.addModule({
    name: 'Save JSON',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Save JSON interface (sends mutliple content block in 1 request, encoded as JSON).',
    depends: [
        'Save',
    ],
    files: [
        __dirname + '/save-rest.js',
    ]
});

builder.addModule({
    name: 'Save REST',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Save REST interface (sends each content block in its own request).',
    depends: [
        'Save',
    ],
    files: [
        __dirname + '/save-rest.js',
    ]
});

builder.addModule({
    name: 'Snippet Menu',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Menu of customised HTML snippets that can be inserted.',
    files: [
        __dirname + '/document-snippet.png',
        __dirname + '/snippet-menu.js',
        __dirname + '/snippet-menu.scss',
        __dirname + '/templates/item.html'
    ]
});

builder.addModule({
    name: 'Special Characters',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Allows insertion of special characters.',
    files: [
        __dirname + '/edit-symbol.png',
        __dirname + '/special-characters.js',
        __dirname + '/special-characters.scss',
        __dirname + '/templates/dialog.html',
        __dirname + '/templates/tab-button.html',
        __dirname + '/templates/tab-content.html',
        __dirname + '/templates/tab-li.html'
    ]
});

builder.addModule({
    name: 'Statistics',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Enables usage statistics on contents blocks such as word counts. Can warn the user if the content is too long.',
    files: [
        __dirname + '/dashboard.png',
        __dirname + '/statistics.js',
        __dirname + '/statistics.scss',
        __dirname + '/templates/dialog.html'
    ]
});

builder.addModule({
    name: 'Table',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Enables table insertion and modification, as well as extended support for dealing with selection inside table cells.',
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

builder.addModule({
    name: 'Tag Menu',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Menu of block elements (H1, H2, P, etc) that can be set.',
    files: [
        __dirname + '/edit.png',
        __dirname + '/tag-menu.js',
        __dirname + '/tag-menu.scss',
        __dirname + '/templates/menu.html'
    ]
});

builder.addModule({
    name: 'Text Align',
    type: 'plugin',
    group: 'Text styling',
    description: 'Text alignment buttons (left, right, center, justify)',
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

builder.addModule({
    name: 'Bold',
    type: 'plugin',
    group: 'Text styling',
    description: 'Button for toggling bold text.',
    files: [
        __dirname + '/bold.js',
        __dirname + '/style/bold-front-end.scss',
        __dirname + '/style/bold.scss',
        __dirname + '/style/images/edit-bold.png',
    ]
});

builder.addModule({
    name: 'Italic',
    type: 'plugin',
    group: 'Text styling',
    description: 'Button for toggling italic text.',
    files: [
        __dirname + '/italic.js',
        __dirname + '/style/italic-front-end.scss',
        __dirname + '/style/italic.scss',
        __dirname + '/style/images/edit-italic.png',
    ]
});

builder.addModule({
    name: 'Strike Through',
    type: 'plugin',
    group: 'Text styling',
    description: 'Button for toggling struck out text.',
    files: [
        __dirname + '/strike.js',
        __dirname + '/style/strike-front-end.scss',
        __dirname + '/style/strike.scss',
        __dirname + '/style/images/edit-strike.png',
    ]
});

builder.addModule({
    name: 'Block Quote',
    type: 'plugin',
    group: 'Text styling',
    description: 'Button to toggle the &lt;blockquote&gt; element',
    files: [
        __dirname + '/block-quote.js',
        __dirname + '/style/block-quote.scss',
        __dirname + '/style/bold-front-end.scss',
        __dirname + '/style/images/edit-quotation.png',
    ]
});

builder.addModule({
    name: 'Text Style',
    type: 'plugin',
    group: 'Text styling',
    description: 'Buttons for increasing and decreasing the text size.',
    files: [
        __dirname + '/size-decrease.js',
        __dirname + '/size-increase.js',
        __dirname + '/style/images/edit-size-down.png',
        __dirname + '/style/images/edit-size-up.png',
    ]
});

builder.addModule({
    name: 'Underline',
    type: 'plugin',
    group: 'Text styling',
    description: 'Button for toggling underlined text.',
    files: [
        __dirname + '/underline.js',
        __dirname + '/style/underline-front-end.scss',
        __dirname + '/style/underline.scss',
        __dirname + '/style/images/edit-underline.png'
    ]
});

builder.addModule({
    name: 'Subscript/Superscript',
    type: 'plugin',
    group: 'Text styling',
    description: 'Buttons for toggling sub and super scripts elements.',
    files: [
        __dirname + '/strike.js',
        __dirname + '/sub.js',
        __dirname + '/super.js',
        __dirname + '/style/sub.scss',
        __dirname + '/style/super.scss',
        __dirname + '/style/images/edit-subscript.png',
        __dirname + '/style/images/edit-superscript.png',
    ]
});

builder.addModule({
    name: 'Tool Tip',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Makes tool tips prettier.',
    files: [
        __dirname + '/tip.png',
        __dirname + '/tool-tip.js',
        __dirname + '/tool-tip.scss'
    ]
});

builder.addModule({
    name: 'Unsaved Edit Warning',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Displays a message in the corner of the browser when there is unsaved changes to an editable block on the page.',
    files: [
        __dirname + '/unsaved-edit-warning.js',
        __dirname + '/unsaved-edit-warning.scss',
        __dirname + '/templates/warning.html'
    ]
});

builder.addModule({
    name: 'View Source',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Allows the user to view and edit the source code for a editable block.',
    files: [
        __dirname + '/edit-code.png',
        __dirname + '/view-source.js',
        __dirname + '/view-source.scss',
        __dirname + '/templates/dialog.html'
    ]
});

