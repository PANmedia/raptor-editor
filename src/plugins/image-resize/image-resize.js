/**
 * @fileOverview Contains the image resize button code.
 * @author David Neilsen <david@panmedia.co.nz>
 */
Raptor.registerUi(new DialogButton({
    name: 'imageResize',
    proportional: true,
    image: null,
    dialogOptions: {
        width: 450
    },

    action: function() {
        var dialog = this.getDialog();
        this.image = nodeUniqueId(this.layout.target);
        this.originalWidth = this.layout.target.width;
        this.originalHeight = this.layout.target.height;
        dialog.find('[name=width]').val(this.layout.target.width),
        dialog.find('[name=height]').val(this.layout.target.height);
        this.openDialog();
    },

    applyAction: function() {
        var dialog = this.getDialog(),
            width = dialog.find('[name=width]').val(),
            height = dialog.find('[name=height]').val();
        this.raptor.actionApply(function() {
            $('#' + this.image)
                .css({
                    width: width,
                    height: height
                })
                .attr('width', width)
                .attr('height', height);
            selectionSelectOuter($('#' + this.image)[0]);
        }.bind(this));
    },

    getDialogTemplate: function() {
        var template = $('<div>').html(this.raptor.getTemplate('image-resize.dialog', this.options)),
            plugin = this;
        template.find('.' + this.options.baseClass + '-lock-proportions')
            .hover(function() {
                $(this).addClass('ui-state-hover');
            }, function() {
                $(this).removeClass('ui-state-hover');
            })
            .click(function() {
                dialogs[plugin.name].instance.proportional = !dialogs[plugin.name].instance.proportional;
                $(this)
                    .find('.ui-icon')
                    .toggleClass('ui-icon-locked', plugin.proportional)
                    .toggleClass('ui-icon-unlocked', !plugin.proportional);
            });

        var widthInput = template.find('[name=width]'),
            heightInput = template.find('[name=height]');

        widthInput.on('input.raptor', function() {
            var value = parseInt($(this).val());
            if (!isNaN(value)) {
                if (dialogs[plugin.name].instance.proportional) {
                    heightInput.val(Math.round(Math.abs(dialogs[plugin.name].instance.originalHeight / dialogs[plugin.name].instance.originalWidth * value)));
                }
            }
        });

        heightInput.on('input.raptor', function() {
            var value = parseInt($(this).val());
            if (!isNaN(value)) {
                if (dialogs[plugin.name].instance.proportional) {
                    widthInput.val(Math.round(Math.abs(dialogs[plugin.name].instance.originalWidth / dialogs[plugin.name].instance.originalHeight * value)));
                }
            }
        });

        return template;
    }
}));
