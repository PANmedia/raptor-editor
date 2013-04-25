/**
 * @fileOverview Contains the rails Raptor preset.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * @namespace Rails preset for Raptor.
 */
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
                ['textSizeDecrease', 'textSizeIncrease'],
                ['clearFormatting'],
                ['linkCreate', 'linkRemove'],
                ['embed'],
                ['floatLeft', 'floatNone', 'floatRight'],
                ['colorMenuBasic'],
                ['tagMenu'],
                ['tableCreate', 'tableInsertRow', 'tableDeleteRow', 'tableInsertColumn', 'tableDeleteColumn', 'tableMergeCells', 'tableSplitCells']
            ]
        }
    }
});

