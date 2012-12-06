v0.5.0
---
 - Rewrote plugin/UI architecture
   - Adjusted exiting plugins/UI
 - Updated translations to use keys instead of english strings
 - Preview action when you hover a button
 - Restore selection after an action is applied
 - Improved performance
   - Updated selection/change checking
   - Removed HTML cleaning (HTML should now always be clean)
   - Removed rangy markers (serialized ranges)
   - Use static/shared dialogs
   - Only create toolbar/buttons/menus/dialogs when first used
 - Decoupled layout (messaging system still need decoupling)
 - Many bug fixes
 - Added lots of tests
 - Added option presets
 - Updated build script to create smaller, more targeted builds


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

