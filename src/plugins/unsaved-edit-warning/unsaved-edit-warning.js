/**
 * @fileOverview Contains the unsaved edit warning plugin class code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

var unsavedEditWarningDirty = 0,
    unsavedEditWarningElement = null;

/**
 * The unsaved edit warning plugin.
 *
 * @constructor
 * @augments RaptorPlugin
 *
 * @param {String} name
 * @param {Object} overrides Options hash.
 */
function UnsavedEditWarningPlugin(name, overrides) {
    RaptorPlugin.call(this, name || 'unsavedEditWarning', overrides);
}

UnsavedEditWarningPlugin.prototype = Object.create(RaptorPlugin.prototype);

/**
 * Enables the unsaved edit warning plugin.
 *
 * @todo raptor details
 * @param {type} raptor
 */
UnsavedEditWarningPlugin.prototype.enable = function(raptor) {
    this.raptor.bind('dirty', this.show.bind(this));
    this.raptor.bind('cleaned', this.hide.bind(this));
};

/**
 * Shows the unsaved edit warning.
 */
UnsavedEditWarningPlugin.prototype.show = function() {
    unsavedEditWarningDirty++;
    if (unsavedEditWarningDirty > 0) {
        elementBringToTop(this.getElement(this));
        this.getElement(this).addClass('raptor-unsaved-edit-warning-visible');
    }
};

/**
 * Hides the unsaved edit warning.
 *
 * @param event The mouse event that triggers the function.
 */
UnsavedEditWarningPlugin.prototype.hide = function(event) {
    unsavedEditWarningDirty--;
    if (unsavedEditWarningDirty === 0) {
        this.getElement(this).removeClass('raptor-unsaved-edit-warning-visible');
    }
};

/**
 * Prepares and returns the unsaved edit warning element for use in the Raptor UI.
 *
 * @todo instance details
 * @param {type} instance
 * @returns {Element}
 */
UnsavedEditWarningPlugin.prototype.getElement = function(instance) {
    if (!unsavedEditWarningElement) {
        unsavedEditWarningElement = $(this.raptor.getTemplate('unsaved-edit-warning.warning', this.options))
            .mouseenter(function() {
                Raptor.eachInstance(function(editor) {
                    if (editor.isDirty()) {
                        editor.getElement().addClass('raptor-unsaved-edit-warning-dirty');
                    }
                });
            })
            .mouseleave(function() {
                $('.raptor-unsaved-edit-warning-dirty').removeClass('raptor-unsaved-edit-warning-dirty');
            })
            .appendTo('body');
    }
    return unsavedEditWarningElement;
};

Raptor.registerPlugin(new UnsavedEditWarningPlugin());
