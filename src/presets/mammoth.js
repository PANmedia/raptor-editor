Raptor.defaults = $.extend(basePreset, {
    layout: {
        type: 'toolbar',
        options: {
            uiOrder: [
                ['save', 'cancel'],
                ['dockToScreen', 'guides'],
                ['viewSource'],
                ['historyUndo', 'historyRedo'],
                ['alignLeft', 'alignCenter', 'alignJustify', 'alignRight'],
                ['textBold', 'textItalic', 'textUnderline', 'textStrike'],
                ['textSuper', 'textSub'],
                ['listUnordered', 'listOrdered'],
                ['hrCreate', 'textBlockQuote'],
                ['textSizeIncrease', 'textSizeDecrease'],
                ['clearFormatting'],
                ['linkCreate', 'linkRemove'],
                ['embed', 'insertFile'],
                ['floatLeft', 'floatNone', 'floatRight'],
                ['tagMenu'],
                ['classMenu'],
                ['snippetMenu'],
                ['tableCreate', 'tableInsertRow', 'tableDeleteRow', 'tableInsertColumn', 'tableDeleteColumn', 'tableMergeCells', 'tableSplitCells']
            ]
        }
    }
});

