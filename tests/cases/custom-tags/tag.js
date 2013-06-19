/**
 * @fileOverview Tag helper functions.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */



/**
 * Applies a tag to a selection based on a class name.
 *
 * @param {type} tag The tag that is to be applied to the selection.
 * @param {type} className The class name that is to have the tag applied to it within the selection.
 */
function tagCustomApplyToSelection(tag, className) {
    var applier = rangy.createCssClassApplier(className, {
        elementTagName: tag
    });
    applier.applyToSelection();
}

/**
 * Removes a tag from a selection based on a class name.
 *
 * @param {type} tag The tag that is to be removed from the selection.
 * @param {type} className The class name that is to have the tag removed from it within the selection.
 */
function tagCustomRemoveFromSelection(tag, className) {
    var applier = rangy.createCssClassApplier(className, {
        elementTagName: tag
    });
    applier.undoToSelection();
}
