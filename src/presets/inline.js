/**
 * @fileOverview Contains the inline preset.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 */

/**
 * @namespace Inline preset for Raptor.
 */
Raptor.registerPreset({
    name: 'inline',
    classes: 'raptor-editing-inline',
    autoEnable: true,
    draggable: false,
    unify: false,
    unloadWarning: false,
    reloadOnDisable: true,
    plugins: {
        unsavedEditWarning: false,
        dock: {
            dockToElement: true,
            docked: true,
            persist: false
        }
    },
    layouts: {
        toolbar: {
            uiOrder: [
                ['textBold', 'textItalic', 'textUnderline', 'textStrike'],
                ['colorMenuBasic'],
                ['textBlockQuote'],
                ['listOrdered', 'listUnordered'],
                ['textSizeDecrease', 'textSizeIncrease'],
                ['linkCreate', 'linkRemove']
            ]
        }
    }
});
