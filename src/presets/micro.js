/**
 * @fileOverview Contains the micro options preset.
 * @license http://www.raptor-editor.com/license
 * @author David Neilsen <david@panmedia.co.nz>
 */

/**
 * @namespace Micro options for Raptor.
 */
Raptor.registerPreset({
    name: 'micro',
    layouts: {
        toolbar: {
            uiOrder: [
                ['logo'],
                ['save', 'cancel'],
                ['dockToScreen', 'dockToElement'],
                ['historyUndo', 'historyRedo'],
                ['specialCharacters'],
                ['languageMenu'],
                ['statistics']
            ]
        },
        hoverPanel: {
            uiOrder: [
                ['clickButtonToEdit', 'revisions']
            ]
        }
    },
    plugins: {
        placeholder: false,
        paste: {
            panels: [
                'plain-text'
            ]
        },
        noBreak: {
            enabled: true
        }
    }
});
