



function tagCustomApplyToSelection(tag, className) {
    var applier = rangy.createCssClassApplier(className, {
        elementTagName: tag
    });
    applier.applyToSelection();
}

function tagCustomRemoveFromSelection(tag, className) {
    var applier = rangy.createCssClassApplier(className, {
        elementTagName: tag
    });
    applier.undoToSelection();
}
