To Do:
---

 - Make `HoverPanel` extend from `ElementHoverPanel`
 - Make `ElementHoverPanel` accept multiple configurations for difference elements.
 - Ensure text box height in dialogs is fixed for all plugins.

v1.5.0 (WIP)
---

*API Changes:*
 - File manager will no longer refresh during initialisation. When using standalone you must call `rfm.refresh()`.

*Updates:*
 - Event names are now normalised by lowercasing, and removing all non alphabetic characters from them. This allows for
 - Added `callback` option to the `save` plugin instead of requiring a full save plugin implementation.

v1.4.1
---

*Updates:*
 - Added `resetUi` option to the `linkCreate` plugin.
 - Added a `raptor-ui` class to all UI elements and hide them on print media.
 - Make external links open in target `_blank` by default.
 - Move tag menu tags to options.
 - Cleaned up old build files.

v1.4.0
---

*Updates:*
 - Added front end class to tables.
 - Added `insert-nodes` event, used by paste plugin after pasting and allow plugins to cleanup or normalise content.
 - Added ability to open link while editing by holding `ctrl` then clicking the link.

*API Changes:*
 - Rename `selectionCustomise` event to `selection-customise`. Bind option should support both.
 - Update `selectionReplace` to only accept a node or a string.

v1.3.0
---

*API Changes:*

 - Changed option inheritance to to inherit from `component.options` -> `raptor.options` -> `config.options` in that order. It was `raptor.options` -> `component.options` -> `config.options`. This allows setting a single option to effect all plugins.

*Example:*

```
$('.editable').raptor({
    previewTimeout: 1000
});
```

v1.2.7
---

*Updates:*

 - Allow tables in cleaned pasted content.
 - Allow more data customisation in the JSON save plugin.
 - Add `checkDirty` option to save plugins to allow saving even if Raptor thinks the content is up to date.

v1.2.6
---

*Updates:*

 - Added delay to hover preview actions.
 - Added Amazon S3 file manager backend beta.

*Fixes:*

 - Fixed removing links in some situations.
 - Fixed some height issues with text box sizes in dialogs.
 - Fixed paste capture events in IE.
 - Fixed updating links attributes.

v1.2.5
---

*Updates:*

 - Added `dockTo` option.
 - Remove customised list toggling in favour of `execCommand`.

v1.2.4
---

*Updates:*

 - Added `elementHoverPanel`, used for image hover toolbar.
 - Added `imageSwap` button.
 - Added `close` button, used from `ElementHoverPanel`.
 - Fires input event on `textarea` when Raptor is changed.
 - The insert file plugin now replaces image.
 - Change `autoSelect` option to a select either select the start, end, all.

*API Changes:*

 - Deprecated `raptor.getUi()` in favour of a single `raptor.getPlugin()` method.
 - Refactored `imageResizeButton` into `imageResize`, using `DialogButton`, and `ElementHoverPanel`

v1.2.3
---

*Updates:*

 - Expose the global `Raptor` object to `$.fn.raptor.Raptor`
 - Add `autoSelect` option to select all text when enabling the Raptor.

*Fixes:*

 - Fixed restoring the text color after previewing.
 - Fixed overriding color when editing inline.
 - Fixed test runner includes.
 - Prevent XULRunner throwing an error when trying to access `localStorage`

*API Changes:*

 - Removed `div` from the default allowed elements when pasting.

v1.2.2
---

*Updates:*

 - Add hotkey to bypass paste dialog (`ctrl` + `shift` + `v`).
 - Add `retain` option to save plugin to keep editor open after saving.
 - Automatically translated Raptor into about 40 languages.

*Fixes:*

 - Fixed icon size for flags and button (when used with font icons).

v1.2.1
---

*Updates:*

 - Show the user a message is save is not configured.

*Fixes:*

 - Fixed some build options.

v1.2.0
---

*Updates:*

 - Pass `data`, `status`, and `xhr` to save plugin callbacks.

*Fixes:*

 - Fix docked toolbar not always putting the correct size spacer in.

*API Changes:*

 - Changed event system to allow passing arguments.
 - Removed `before` and `after`.
 - Raptor no longer fires `global` events when `instance` events are triggered.

v0.9.0
---

*Updates:*

 - Moved messaging system into a layout plugin.
 - Added hover panel layout.

*API Changes:*

 - Changed layout initialisation syntax.

v0.5.0
---

*Updates:*

 - Preview action when you hover a button
 - Restore selection after an action is applied
 - Improved performance
   - Updated selection/change checking
   - Removed HTML cleaning (HTML should now always be clean)
   - Removed rangy markers (serialized ranges)
   - Use static/shared dialogs
   - Only create toolbar/buttons/menus/dialogs when first used
 - Many bug fixes
 - Added lots of tests
 - Added option presets
 - Updated build script to create smaller, more targeted builds

*API Changes:*

 - Renamed variables from 'editor' to 'raptor' to prevent conflicts
 - Decoupled layout (messaging system still needs decoupling)
 - Rewrote plugin/UI architecture
   - Adjusted exiting plugins/UI
   - Remove 'ui' option in initialisation, all ui options should be placed in the 'plugins' option
 - Updated translations to use keys instead of english strings
 - Changed save REST options


v0.0.30
---
Fixed encoding issue in Swedish translation.

v0.0.28 - v0.0.29
---
Fixed incorrect builds.

v0.0.27
---

*API Changes:*

 - Changed save REST plugin to no longer pass though and ID parameter to callbacks.

*Fixes:*

 - Fixed include.php loader, which was missing some files, and loading older plugins.
 - Fixed hotkeys, and added hotkeys plugin detection.

*Other:*

 - Add save rest example/test page.
 - Updated swedish translation.

