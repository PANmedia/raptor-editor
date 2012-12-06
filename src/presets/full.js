Raptor.defaults = $.extend(basePreset, {
    layout: {
        type: 'toolbar',
        options: {
            uiOrder: [
                ['logo'],
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
                ['colorPickerBasic'],
                ['clearFormatting'],
                ['linkCreate', 'linkRemove'],
                ['embed'],
                ['floatLeft', 'floatNone', 'floatRight'],
                ['tagMenu'],
                ['statistics']
            ]
        }
    }
});
