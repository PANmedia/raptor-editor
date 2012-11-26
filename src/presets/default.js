Raptor.registerPreset('toolbar', {
    layout: {
        type: 'toolbar',
        options: {
//            uiOrder: [
//                ['logo'],
//                ['save', 'cancel'],
//                ['dock', 'showGuides', 'clean'],
//                ['viewSource'],
//                ['undo', 'redo'],
//                ['alignLeft', 'alignCenter', 'alignJustify', 'alignRight'],
//                ['textBold', 'textItalic', 'textUnderline', 'textStrike'],
//                ['textSuper', 'textSub'],
//                ['listUnordered', 'listOrdered'],
//                ['hr', 'quoteBlock'],
//                ['fontSizeInc', 'fontSizeDec'],
//                ['colorPickerBasic'],
//                ['clearFormatting'],
//                ['link', 'unlink'],
//                ['embed'],
//                ['floatLeft', 'floatNone', 'floatRight'],
//                ['tagMenu'],
//                ['i18n'],
//                ['raptorize'],
//                ['statistics'],
//                ['debugReinit', 'debugDestroy']
//            ]
        }
    }
});

$.extend(Raptor.defaults, Raptor.presets.toolbar);
