To Do:
---

 - Change `autoSelect` option to a generic select object to either select the start, end, all, or none.
 - Make `HoverPanel` extend from `ElementHoverPanel` 
 - Make `ElementHoverPanel` accept multiple configurations for difference elements.

v1.2.4
---

*Updates:*

 - Added `elementHoverPanel`, used for image hover toolbar.
 - Added `imageSwap` button.
 - Added `close` button, used from `ElementHoverPanel`.
 - Fires input event on `textarea` when Raptor is changed.
 - The insert file plugin now replaces image.

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

