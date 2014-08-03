builder.addModule({
    name: 'Cancel',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Button to prompt the user to disable editing and revert all changes back to their original state.',
    root: __dirname + '/cancel',
    files: [
        __dirname + '/cancel/cancel.js',
        __dirname + '/cancel/cancel.scss',
        __dirname + '/cancel/cross.png'
    ]
});

builder.addModule({
    name: 'Class Menu',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Drop down menu to allow selecting a class to be applied to a block level element.',
    root: __dirname + '/class-menu',
    files: [
        __dirname + '/class-menu/class-menu.js',
        __dirname + '/class-menu/class-menu.scss',
        __dirname + '/class-menu/palette-paint-brush.png',
        __dirname + '/class-menu/templates/item.html'
    ]
});

builder.addModule({
    name: 'Clean Block',
    type: 'plugin',
    group: 'Text styling',
    description: 'Button that removes all inline styles, empty spans, empty list items, etc.',
    root: __dirname + '/clean-block',
    files: [
        __dirname + '/clean-block/clean-block.js',
        __dirname + '/clean-block/broom.png',
        __dirname + '/clean-block/clean-block.scss'
    ]
});

builder.addModule({
    name: 'Clear Formatting',
    type: 'plugin',
    group: 'Text styling',
    description: 'Button that removes all formatting from the selected text.',
    root: __dirname + '/clear-formatting',
    files: [
        __dirname + '/clear-formatting/clear-formatting.js',
        __dirname + '/clear-formatting/clear-formatting.png',
        __dirname + '/clear-formatting/clear-formatting.scss'
    ]
});

builder.addModule({
    name: 'Click Button To Edit',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Button that appears over an editable block when the mouse hovers it that when clicked enables Raptor.',
    root: __dirname + '/click-button-to-edit',
    files: [
        __dirname + '/click-button-to-edit/click-button-to-edit.js',
        __dirname + '/click-button-to-edit/click-button-to-edit.scss',
        __dirname + '/click-button-to-edit/pencil.png',
        __dirname + '/click-button-to-edit/templates/button.html'
    ]
});

builder.addModule({
    name: 'Close',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Button to allow closing of panels.',
    root: __dirname + '/close',
    files: [
        __dirname + '/close/close.js',
        __dirname + '/close/close.scss',
        __dirname + '/close/cross.png'
    ]
});

builder.addModule({
    name: 'Color Menu Basic',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Drop down menu to allow changing text color.',
    root: __dirname + '/color-menu-basic',
    files: [
        __dirname + '/color-menu-basic/color-menu-basic-front-end.scss',
        __dirname + '/color-menu-basic/color-menu-basic.js',
        __dirname + '/color-menu-basic/color-menu-basic.scss',
        __dirname + '/color-menu-basic/templates/automatic.html',
        __dirname + '/color-menu-basic/templates/item.html',
    ]
});

builder.addModule({
    name: 'Dock',
    type: 'plugin',
    group: 'Other plugins',
    root: __dirname + '/dock',
    files: [
        __dirname + '/dock/dock-plugin.js',
        __dirname + '/dock/dock.scss'
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
    root: __dirname + '/dock',
    files: [
        __dirname + '/dock/application-dock-090.png',
        __dirname + '/dock/dock-to-screen.js',
        __dirname + '/dock/dock-to-screen.scss',
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
    root: __dirname + '/dock',
    files: [
        __dirname + '/dock/application-dock-tab.png',
        __dirname + '/dock/dock-to-element.js',
        __dirname + '/dock/dock-to-element.scss',
    ]
});


builder.addModule({
    name: 'Embed',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Allows embedding of video, flash, and other widgets.',
    root: __dirname + '/embed',
    files: [
        __dirname + '/embed/embed.js',
        __dirname + '/embed/embed.scss',
        __dirname + '/embed/youtube.png',
        __dirname + '/embed/templates/dialog.html'
    ]
});

builder.addModule({
    name: 'Float',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Allows aligning (floating) images.',
    root: __dirname + '/float',
    files: [
        __dirname + '/float/edit-image-none.png',
        __dirname + '/float/edit-image-right.png',
        __dirname + '/float/edit-image.png',
        __dirname + '/float/float-front-end.scss',
        __dirname + '/float/float-left.js',
        __dirname + '/float/float-none.js',
        __dirname + '/float/float-right.js',
        __dirname + '/float/float.scss'
    ]
});

builder.addModule({
    name: 'Font Family',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Drop down menu to allow changing text font family.',
    root: __dirname + '/font-family',
    files: [
        __dirname + '/font-family/font-family.js',
        __dirname + '/font-family/font-family.scss',
        __dirname + '/font-family/font-family-front-end.scss',
        __dirname + '/font-family/templates/menu-item.html',
    ]
});

builder.addModule({
    name: 'Guides',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Toggle guides (outlines) around block elements inside an editable region.',
    root: __dirname + '/guides',
    files: [
        __dirname + '/guides/guide.png',
        __dirname + '/guides/guides.js',
        __dirname + '/guides/guides.scss'
    ]
});

builder.addModule({
    name: 'History',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Adds undo and redo buttons.',
    root: __dirname + '/history',
    files: [
        __dirname + '/history/arrow-curve-180-left.png',
        __dirname + '/history/arrow-curve.png',
        __dirname + '/history/history-redo.js',
        __dirname + '/history/history-undo.js',
        __dirname + '/history/history.scss'
    ]
});

builder.addModule({
    name: 'Hr',
    type: 'plugin',
    group: 'Text styling',
    description: 'Button to insert horizontal rule elements',
    root: __dirname + '/hr',
    files: [
        __dirname + '/hr/edit-rule.png',
        __dirname + '/hr/hr-create.js',
        __dirname + '/hr/hr.scss'
    ]
});

builder.addModule({
    name: 'Image Resize',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Allows resizing images by hovering over them and clicking a button to open a resize dialog.',
    root: __dirname + '/image-resize',
    files: [
        __dirname + '/image-resize/image-resize.js',
        __dirname + '/image-resize/image-resize.scss',
        __dirname + '/image-resize/image-resize.png',
        __dirname + '/image-resize/templates/dialog.html'
    ]
});

builder.addModule({
    name: 'Image Swap',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Allows swapping images by hovering over them and clicking a button to open a file selection dialog.',
    root: __dirname + '/image-swap',
    files: [
        __dirname + '/image-swap/image-swap.js',
        __dirname + '/image-swap/image-swap.scss',
        __dirname + '/image-swap/images.png'
    ]
});

builder.addModule({
    name: 'Insert File',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Allows simple insertion of images etc.',
    root: __dirname + '/insert-file',
    files: [
        __dirname + '/insert-file/image.png',
        __dirname + '/insert-file/insert-file.js',
        __dirname + '/insert-file/insert-file.scss',
        __dirname + '/insert-file/templates/dialog.html'
    ]
});

builder.addModule({
    name: 'Language Menu',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Allows switching Raptor\'s language while editing.',
    root: __dirname + '/language-menu',
    files: [
        __dirname + '/language-menu/language-menu.js',
        __dirname + '/language-menu/language-menu.scss',
        __dirname + '/language-menu/flags/ae.png',
        __dirname + '/language-menu/flags/bg.png',
        __dirname + '/language-menu/flags/ca.png',
        __dirname + '/language-menu/flags/cn.png',
        __dirname + '/language-menu/flags/cz.png',
        __dirname + '/language-menu/flags/de.png',
        __dirname + '/language-menu/flags/dk.png',
        __dirname + '/language-menu/flags/ee.png',
        __dirname + '/language-menu/flags/en.png',
        __dirname + '/language-menu/flags/es.png',
        __dirname + '/language-menu/flags/fi.png',
        __dirname + '/language-menu/flags/fr.png',
        __dirname + '/language-menu/flags/gr.png',
        __dirname + '/language-menu/flags/ht.png',
        __dirname + '/language-menu/flags/hu.png',
        __dirname + '/language-menu/flags/id.png',
        __dirname + '/language-menu/flags/il.png',
        __dirname + '/language-menu/flags/in.png',
        __dirname + '/language-menu/flags/ir.png',
        __dirname + '/language-menu/flags/it.png',
        __dirname + '/language-menu/flags/jp.png',
        __dirname + '/language-menu/flags/kr.png',
        __dirname + '/language-menu/flags/lt.png',
        __dirname + '/language-menu/flags/lv.png',
        __dirname + '/language-menu/flags/my.png',
        __dirname + '/language-menu/flags/nl.png',
        __dirname + '/language-menu/flags/no.png',
        __dirname + '/language-menu/flags/other.png',
        __dirname + '/language-menu/flags/pk.png',
        __dirname + '/language-menu/flags/pl.png',
        __dirname + '/language-menu/flags/pt.png',
        __dirname + '/language-menu/flags/ro.png',
        __dirname + '/language-menu/flags/ru.png',
        __dirname + '/language-menu/flags/se.png',
        __dirname + '/language-menu/flags/si.png',
        __dirname + '/language-menu/flags/sk.png',
        __dirname + '/language-menu/flags/th.png',
        __dirname + '/language-menu/flags/tr.png',
        __dirname + '/language-menu/flags/ua.png',
        __dirname + '/language-menu/flags/vn.png',
        __dirname + '/language-menu/templates/item.html'
    ]
});

builder.addModule({
    name: 'Link',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Allows links to be creates and removed including email, internal, external and file/document links.',
    root: __dirname + '/link',
    files: [
        __dirname + '/link/chain-unchain.png',
        __dirname + '/link/chain.png',
        __dirname + '/link/link-create.js',
        __dirname + '/link/link-open.js',
        __dirname + '/link/link-remove.js',
        __dirname + '/link/link-type-document.js',
        __dirname + '/link/link-type-email.js',
        __dirname + '/link/link-type-external.js',
        __dirname + '/link/link-type-internal.js',
        __dirname + '/link/link.scss',
        __dirname + '/link/templates/dialog.html',
        __dirname + '/link/templates/document.html',
        __dirname + '/link/templates/email.html',
        __dirname + '/link/templates/error.html',
        __dirname + '/link/templates/external.html',
        __dirname + '/link/templates/file-url.html',
        __dirname + '/link/templates/internal.html',
        __dirname + '/link/templates/label.html'
    ]
});

builder.addModule({
    name: 'List',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Allows orders and unordered lists to be inserted.',
    root: __dirname + '/list',
    files: [
        __dirname + '/list/edit-list-order.png',
        __dirname + '/list/edit-list.png',
        __dirname + '/list/list-ordered.js',
        __dirname + '/list/list-unordered.js',
        __dirname + '/list/list.scss'
    ]
});

builder.addModule({
    name: 'Logo',
    type: 'plugin',
    group: 'Premium plugins',
    description: 'Displays logo and optionally sends usage statistics to the Raptor website.',
    root: __dirname + '/logo',
    files: [
        __dirname + '/logo/logo.js',
        __dirname + '/logo/logo.scss',
        __dirname + '/logo/raptor.png'
    ]
});


builder.addModule({
    name: 'No Break',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Prevents content breaking out of its wrapper. Used for editing single lines of text.',
    root: __dirname + '/no-break',
    files: [
        __dirname + '/no-break/no-break.js'
    ]
});

builder.addModule({
    name: 'Normalise Line Breaks',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Normalises the elements inserted when pressing enter/return.',
    root: __dirname + '/normalise-line-breaks',
    files: [
        __dirname + '/normalise-line-breaks/normalise-line-breaks.js'
    ]
});

builder.addModule({
    name: 'Paste',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Enables triggering a dialog input on a paste event to clean pasted content.',
    root: __dirname + '/paste',
    files: [
        __dirname + '/paste/paste.js',
        __dirname + '/paste/paste.scss',
        __dirname + '/paste/templates/dialog.html'
    ]
});

builder.addModule({
    name: 'Placeholder',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Add default place holder content to editable elements when the are initialised on a empty block.',
    root: __dirname + '/placeholder',
    files: [
        __dirname + '/placeholder/placeholder.js'
    ]
});

builder.addModule({
    name: 'Save',
    type: 'plugin',
    group: 'Other plugins',
    root: __dirname + '/save',
    files: [
        __dirname + '/save/disk-black.png',
        __dirname + '/save/save.js',
        __dirname + '/save/save.scss'
    ]
});

builder.addModule({
    name: 'Save JSON',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Save JSON interface (sends multiple content block in 1 request, encoded as JSON).',
    depends: [
        'Save',
    ],
    root: __dirname + '/save',
    files: [
        __dirname + '/save/save-json.js',
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
    root: __dirname + '/save',
    files: [
        __dirname + '/save/save-rest.js',
    ]
});

builder.addModule({
    name: 'Snippet Menu',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Menu of customised HTML snippets that can be inserted.',
    root: __dirname + '/snippet-menu',
    files: [
        __dirname + '/snippet-menu/document-snippet.png',
        __dirname + '/snippet-menu/snippet-menu.js',
        __dirname + '/snippet-menu/snippet-menu.scss',
        __dirname + '/snippet-menu/templates/item.html'
    ]
});

builder.addModule({
    name: 'Special Characters',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Allows insertion of special characters.',
    root: __dirname + '/special-characters',
    files: [
        __dirname + '/special-characters/edit-symbol.png',
        __dirname + '/special-characters/special-characters.js',
        __dirname + '/special-characters/special-characters.scss',
        __dirname + '/special-characters/templates/dialog.html',
        __dirname + '/special-characters/templates/tab-button.html',
        __dirname + '/special-characters/templates/tab-content.html',
        __dirname + '/special-characters/templates/tab-li.html'
    ]
});

builder.addModule({
    name: 'Statistics',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Enables usage statistics on contents blocks such as word counts. Can warn the user if the content is too long.',
    root: __dirname + '/statistics',
    files: [
        __dirname + '/statistics/dashboard.png',
        __dirname + '/statistics/statistics.js',
        __dirname + '/statistics/statistics.scss',
        __dirname + '/statistics/templates/dialog.html'
    ]
});

builder.addModule({
    name: 'Table',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Enables table insertion and modification, as well as extended support for dealing with selection inside table cells.',
    depends: [
        'GoogTable',
        'ResizeTable',
    ],
    root: __dirname + '/table',
    files: [
        __dirname + '/table/table-cell-button.js',
        __dirname + '/table/table-create.js',
        __dirname + '/table/table-delete-column.js',
        __dirname + '/table/table-delete-row.js',
        __dirname + '/table/table-insert-column.js',
        __dirname + '/table/table-insert-row.js',
        __dirname + '/table/table-merge-cells.js',
        __dirname + '/table/table-split-cells.js',
        __dirname + '/table/table-support.js',
        __dirname + '/table/style/table-support.scss',
        __dirname + '/table/style/table.scss',
        __dirname + '/table/style/images/table-delete-column.png',
        __dirname + '/table/style/images/table-delete-row.png',
        __dirname + '/table/style/images/table-insert-column.png',
        __dirname + '/table/style/images/table-insert-row.png',
        __dirname + '/table/style/images/table-join.png',
        __dirname + '/table/style/images/table-split.png',
        __dirname + '/table/style/images/table.png',
        __dirname + '/table/templates/create-menu.html'
    ]
});

builder.addModule({
    name: 'Tag Menu',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Menu of block elements (H1, H2, P, etc) that can be set.',
    root: __dirname + '/tag-menu',
    files: [
        __dirname + '/tag-menu/edit.png',
        __dirname + '/tag-menu/tag-menu.js',
        __dirname + '/tag-menu/tag-menu.scss',
        __dirname + '/tag-menu/templates/item.html'
    ]
});

builder.addModule({
    name: 'Text Align',
    type: 'plugin',
    group: 'Text styling',
    description: 'Text alignment buttons (left, right, center, justify)',
    root: __dirname + '/text-align',
    files: [
        __dirname + '/text-align/text-align-button.js',

        __dirname + '/text-align/center.js',
        __dirname + '/text-align/justify.js',
        __dirname + '/text-align/left.js',
        __dirname + '/text-align/right.js',
        __dirname + '/text-align/style/text-align-front-end.scss',
        __dirname + '/text-align/style/text-align.scss',
        __dirname + '/text-align/style/images/edit-alignment-center.png',
        __dirname + '/text-align/style/images/edit-alignment-justify.png',
        __dirname + '/text-align/style/images/edit-alignment-right.png',
        __dirname + '/text-align/style/images/edit-alignment.png'
    ]
});

builder.addModule({
    name: 'Bold',
    type: 'plugin',
    group: 'Text styling',
    description: 'Button for toggling bold text.',
    root: __dirname + '/text-style',
    files: [
        __dirname + '/text-style/bold.js',
        __dirname + '/text-style/style/bold-front-end.scss',
        __dirname + '/text-style/style/bold.scss',
        __dirname + '/text-style/style/images/edit-bold.png',
    ]
});

builder.addModule({
    name: 'Italic',
    type: 'plugin',
    group: 'Text styling',
    description: 'Button for toggling italic text.',
    root: __dirname + '/text-style',
    files: [
        __dirname + '/text-style/italic.js',
        __dirname + '/text-style/style/italic-front-end.scss',
        __dirname + '/text-style/style/italic.scss',
        __dirname + '/text-style/style/images/edit-italic.png',
    ]
});

builder.addModule({
    name: 'Strike Through',
    type: 'plugin',
    group: 'Text styling',
    description: 'Button for toggling struck out text.',
    root: __dirname + '/text-style',
    files: [
        __dirname + '/text-style/strike.js',
        __dirname + '/text-style/style/strike-front-end.scss',
        __dirname + '/text-style/style/strike.scss',
        __dirname + '/text-style/style/images/edit-strike.png',
    ]
});

builder.addModule({
    name: 'Block Quote',
    type: 'plugin',
    group: 'Text styling',
    description: 'Button to toggle the &lt;blockquote&gt; element',
    root: __dirname + '/text-style',
    files: [
        __dirname + '/text-style/block-quote.js',
        __dirname + '/text-style/style/block-quote.scss',
        __dirname + '/text-style/style/bold-front-end.scss',
        __dirname + '/text-style/style/images/edit-quotation.png',
    ]
});

builder.addModule({
    name: 'Text Style',
    type: 'plugin',
    group: 'Text styling',
    description: 'Buttons for increasing and decreasing the text size.',
    root: __dirname + '/text-style',
    files: [
        __dirname + '/text-style/size-decrease.js',
        __dirname + '/text-style/size-increase.js',
        __dirname + '/text-style/style/text-size.scss',
        __dirname + '/text-style/style/images/edit-size-down.png',
        __dirname + '/text-style/style/images/edit-size-up.png',
    ]
});

builder.addModule({
    name: 'Underline',
    type: 'plugin',
    group: 'Text styling',
    description: 'Button for toggling underlined text.',
    root: __dirname + '/text-style',
    files: [
        __dirname + '/text-style/underline.js',
        __dirname + '/text-style/style/underline-front-end.scss',
        __dirname + '/text-style/style/underline.scss',
        __dirname + '/text-style/style/images/edit-underline.png'
    ]
});

builder.addModule({
    name: 'Subscript/Superscript',
    type: 'plugin',
    group: 'Text styling',
    description: 'Buttons for toggling sub and super scripts elements.',
    root: __dirname + '/text-style',
    files: [
        __dirname + '/text-style/sub.js',
        __dirname + '/text-style/super.js',
        __dirname + '/text-style/style/sub.scss',
        __dirname + '/text-style/style/super.scss',
        __dirname + '/text-style/style/images/edit-subscript.png',
        __dirname + '/text-style/style/images/edit-superscript.png',
    ]
});

builder.addModule({
    name: 'Tool Tip',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Makes tool tips prettier.',
    root: __dirname + '/tool-tip',
    files: [
        __dirname + '/tool-tip/tip.png',
        __dirname + '/tool-tip/tool-tip.js',
        __dirname + '/tool-tip/tool-tip.scss'
    ]
});

builder.addModule({
    name: 'Unsaved Edit Warning',
    type: 'plugin',
    group: 'Other plugins',
    description: 'Displays a message in the corner of the browser when there is unsaved changes to an editable block on the page.',
    root: __dirname + '/unsaved-edit-warning',
    files: [
        __dirname + '/unsaved-edit-warning/unsaved-edit-warning.js',
        __dirname + '/unsaved-edit-warning/unsaved-edit-warning.scss',
        __dirname + '/unsaved-edit-warning/templates/warning.html'
    ]
});

builder.addModule({
    name: 'View Source',
    type: 'plugin',
    group: 'Advanced editing plugins',
    description: 'Allows the user to view and edit the source code for a editable block.',
    root: __dirname + '/view-source',
    files: [
        __dirname + '/view-source/edit-code.png',
        __dirname + '/view-source/view-source.js',
        __dirname + '/view-source/view-source.scss',
        __dirname + '/view-source/templates/dialog.html'
    ]
});

