var unsavedEditWarningDirty = 0,
    unsavedEditWarningElement = null;

function UnsavedEditWarningPlugin(name, overrides) {
    RaptorPlugin.call(this, name || 'unsavedEditWarning', overrides);
}

UnsavedEditWarningPlugin.prototype = Object.create(RaptorPlugin.prototype);

UnsavedEditWarningPlugin.prototype.enable = function(raptor) {
    this.raptor.bind('dirty', this.show.bind(this));
    this.raptor.bind('cleaned', this.hide.bind(this));
};

UnsavedEditWarningPlugin.prototype.show = function() {
    unsavedEditWarningDirty++;
    if (unsavedEditWarningDirty > 0) {
        elementBringToTop(this.getElement(this));
        this.getElement(this).addClass('raptor-unsaved-edit-warning-visible');
    }
};

UnsavedEditWarningPlugin.prototype.hide = function(event) {
    unsavedEditWarningDirty--;
    if (unsavedEditWarningDirty === 0) {
        this.getElement(this).removeClass('raptor-unsaved-edit-warning-visible');
    }
};

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
