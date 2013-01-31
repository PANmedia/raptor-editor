var imageResizeButton = false,
    imageResizeButtonDialog = false
    imageResizeButtonImage = null;

function ImageResizeButtonPlugin(name, overrides) {
    RaptorPlugin.call(this, name || 'imageResizeButton', overrides);
}

ImageResizeButtonPlugin.prototype = Object.create(RaptorPlugin.prototype);

ImageResizeButtonPlugin.prototype.init = function() {
    this.raptor.getElement()
        .on('mouseenter', 'img', this.show.bind(this))
        .on('mouseleave', 'img', this.hide.bind(this));
};

ImageResizeButtonPlugin.prototype.getButton = function() {
    if (imageResizeButton === false) {
        imageResizeButton = $(this.raptor.getTemplate('image-resize-button.button', this.options))
            .click(this.openDialog.bind(this));
        aButton(imageResizeButton, {
            icons: {
                primary: 'ui-icon-resize-image'
            }
        });
        imageResizeButton.appendTo('body');
    }
    return imageResizeButton;
};

ImageResizeButtonPlugin.prototype.getDialog = function() {
    if (imageResizeButtonDialog === false) {
        imageResizeButtonDialog = $(this.raptor.getTemplate('image-resize-button.dialog', this.options));
        var widthInput = imageResizeButtonDialog.find('[name=width]'),
            heightInput = imageResizeButtonDialog.find('[name=height]');
        widthInput.bind('keyup', function() {
            var width = parseInt($(this).val());
            if (!isNaN(width)) {
                heightInput.val(Math.round(Math.abs(imageResizeButtonImage.height / imageResizeButtonImage.width * width)));
            }
        });
        heightInput.bind('keyup', function() {
            var height = parseInt($(this).val());
            if (!isNaN(height)) {
                heightInput.val(Math.round(Math.abs(imageResizeButtonImage.width / imageResizeButtonImage.height * height)));
            }
        });
        aDialog(imageResizeButtonDialog, {
            title: _('imageResizeButtonDialogTitle'),
            buttons: [
                {
                    text: _('imageResizeButtonDialogOKButton'),
                    click: function() {
                        var width = parseInt(widthInput.val()),
                            height = parseInt(heightInput.val());
                        if (!isNaN(width) && !isNaN(height)) {
                            $(imageResizeButtonImage)
                                .css({
                                    width: width,
                                    height: height
                                })
                                .attr('width', width)
                                .attr('height', height);
                        }
                        aDialogClose(imageResizeButtonDialog);
                    }.bind(this),
                    icons: {
                        primary: 'ui-icon-circle-check'
                    }
                },
                {
                    text: _('imageResizeButtonDialogCancelButton'),
                    click: function() {
                        aDialogClose(imageResizeButtonDialog);
                    },
                    icons: {
                        primary: 'ui-icon-circle-close'
                    }
                }
            ]
        });
    }
    return imageResizeButtonDialog;
};

ImageResizeButtonPlugin.prototype.openDialog = function() {
    aDialogOpen(this.getDialog());
};

ImageResizeButtonPlugin.prototype.show = function(event) {
    if (!this.raptor.isEditing()) {
        return;
    }
    imageResizeButtonImage = event.target;
    var visibleRect = elementVisibleRect(imageResizeButtonImage),
        button = this.getButton();
    button.show().css({
        position: 'absolute',
        top:  visibleRect.top  + ((visibleRect.height / 2) - (button.outerHeight() / 2)),
        left: visibleRect.left + ((visibleRect.width / 2)  - (button.outerWidth() / 2))
    });
};

ImageResizeButtonPlugin.prototype.hide = function(event) {
    var button = this.getButton();
    if((event &&
            (event.relatedTarget === button.get(0) ||
             button.get(0) === $(event.relatedTarget).parent().get(0)))) {
        return;
    }
    button.hide();
};

Raptor.registerPlugin(new ImageResizeButtonPlugin());
