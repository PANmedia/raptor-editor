/**
 * @name $
 * @namespace jQuery
 */

/**
 * jQuery UI Editor
 *
 * <p>
 * Events:
 * <dl>
 *   <dt>resize</dt>
 *     <dd>Triggers when the page, or an element is resized to allow plugins to adjust their position</dt>
 *   <dt>change</dt>
 *     <dd>Triggers when ever the element content is change, or the selection is changed</dt>
 *   <dt>ready</dt>
 *     <dd>Triggers after the editor has been initialised, (but possibly before the editor is shown and enabled)</dt>
 *   <dt>show</dt>
 *     <dd>Triggers when the toolbar/dialog is shown</dt>
 *   <dt>hide</dt>
 *     <dd>Triggers when the toolbar/dialog is hidden</dt>
 *   <dt>enabled</dt>
 *     <dd>Triggers when the editing is enabled on the element</dt>
 *   <dt>disabled</dt>
 *     <dd>Triggers when the editing is disabled on the element</dt>
 * </dl>
 * </p>
 *
 * Naming Conventions:
 * In function names and parameters the following keywords mean:
 *  - node: A DOM node
 *  - tag: The tag name, e.g. h1, h2, p, a, etc
 *  - element: A jQuery element, selector, not HTML string (use $.parseHTML instead)
 *
 * @name $.editor
 * @class
 */

/**
 * @name $.ui
 * @namespace  jQuery UI
 */

/**
 * jQuery UI Editor
 * @name $.ui.editor
 * @namespace jQuery UI Editor
 */

/**
 * Default settings for the jQuery UI Editor widget
 * @name $.editor#options
 * @property {boolean} options
 */

/**
 * @name $.editor#reiniting
 * @property {boolean} reiniting
 */

/**
 * @name $.editor#ready
 * @property {boolean} ready
 */

/**
 * @name $.editor#element
 * @property {jQuery} element
 */

/**
 * @name $.editor#toolbar
 * @property {jQuery} toolbar
 */

/**
 * @name $.editor#events
 * @property {Object} events
 */

/**
 * @name $.editor#ui
 * @property {Object} ui
 */

/**
 * @name $.editor#plugins
 * @property {Object} plugins
 */

/**
 * @name $.editor#templates
 * @property {Object} templates
 */

/**
 * @name $.editor#history
 * @property {String[]} history
 */

/**
 * @name $.editor#present
 * @property {int} present
 */

/**
 * Switch to temporarly disable history function. Used when the history is being
 * traversed.
 *
 * @name $.editor#historyEnabled
 * @property {boolean} historyEnabled
 */

/**
 * @name $.editor#originalHtml
 * @property {String} originalHtml
 */

/**
 * @name $.editor.ui
 * @namespace Namespace beneath which all ui components reside
 */

/**
 * @name $.editor.plugin
 * @namespace Namespace beneath which all plugins reside
 */