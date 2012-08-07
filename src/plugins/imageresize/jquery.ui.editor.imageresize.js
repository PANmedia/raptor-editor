/**
 * @name $.editor.plugin.imageResize
 * @augments $.ui.editor.defaultPlugin
 * @class Automatically resize oversized images with CSS and height / width attributes.
 */
$.ui.editor.registerPlugin('imageResize', /** @lends $.editor.plugin.imageResize.prototype */ {

    /**
     * @name $.editor.plugin.imageResize.options
     * @type {Object}
     * @namespace Default options
     * @see $.editor.plugin.imageResize
     */
    options: /** @lends $.editor.plugin.imageResize.options */  {
        allowOversizeImages: false,
        manuallyResizingClass: '',
        resizeButtonClass: '',
        resizingClass: ''
    },

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {

        this.options = $.extend(this.options, {
            manuallyResizingClass: this.options.baseClass + '-manually-resize',
            resizeButtonClass: this.options.baseClass + '-resize-button',
            resizingClass: this.options.baseClass + '-in-progress'
        });

        editor.bind('enabled', this.bind, this);
    },

    /**
     * Bind events
     */
    bind: function() {

        if (!this.options.allowOversizeImages) {
            this.addImageListeners();
            this.editor.bind('change', this.scanForOversizedImages, this);
            this.editor.bind('save', this.save, this);
        }

        this.editor.bind('destroy', this.cancel, this);
        this.editor.bind('cancel', this.cancel, this);

        this.editor.getElement().on('mouseenter.' + this.options.baseClass, 'img', $.proxy(this.imageMouseEnter, this));
        this.editor.getElement().on('mouseleave.' + this.options.baseClass, 'img', $.proxy(this.imageMouseLeave, this));
    },

    /**
     * Remove bindings from editing element.
     */
    unbind: function() {
        if (!this.options.allowOversizeImages) {
            this.removeImageListeners();
            this.editor.unbind('change', this.scanForOversizedImages, this);
        }
        this.editor.getElement().off('mouseenter.' + this.options.baseClass, 'img');
        this.editor.getElement().off('mouseleave.' + this.options.baseClass, 'img');
    },

    /**
     * Add custom image change listeners to editing element's image elements.
     */
    addImageListeners: function() {
        // If the function addEventListener exists, bind our custom image resized event
        this.resized = $.proxy(this.imageResizedByUser, this);
        var plugin = this;
        this.editor.getElement().find('img').each(function(){
            if (this.addEventListener) {
                this.addEventListener('DOMAttrModified', plugin.resized, false);
            }
            if (this.attachEvent) {  // Internet Explorer and Opera
                this.attachEvent('onpropertychange', plugin.resized);
            }
        });
    },

    /**
     * Remove custom image change listeners to editing element's image elements.
     */
    removeImageListeners: function() {
        var plugin = this;
        this.editor.getElement().find('img').each(function(){
            if (this.removeEventListener) {
                this.addEventListener('DOMAttrModified', plugin.resized, false);
            }
            if (this.detachEvent) {
                this.detachEvent('onpropertychange', plugin.resized);
            }
        });
    },

    /**
     * Handler simulating a 'resize' event for image elements
     * @param {Object} event
     */
    imageResizedByUser: function(event) {
        var target = $(event.target);
        if(target.is('img') &&
            target.attr('_moz_resizing') &&
            event.attrName == 'style' &&
            event.newValue.match(/width|height/)) {
            this.editor.fire('change');
        }
    },

    /**
     * Check for oversize images within the editing element
     */
    scanForOversizedImages: function() {
        var element = this.editor.getElement();
        var plugin = this;
        var images = [];
        $(element.find('img')).each(function() {
            // Only resize images automatically if they're too wide
            if (element.width() < $(this).outerWidth()) {
                images.push($(this));
            }
        });

        if (images.length) {
            plugin.resizeOversizedImages(images, element.width());
        }
    },

    /**
     * Proportionately resizes the image, applying width CSS style.
     * @param  {String[]} image The images to be resized
     * @param  {int} maxWidth The editing element's maximum width
     * @param  {int} maxHeight The editing element's maximum height
     */
    resizeOversizedImages: function(images, maxWidth) {

        // Prepare a link to be included in any messages
        var imageLink = $('<a>', {
            href: '',
            target: '_blank'
        });

        for (var i = 0; i < images.length; i++) {

            var image = images[i];
            var width = image.outerWidth();
            var height = image.outerHeight();
            var ratio = Math.min(maxWidth / width);

            width = Math.round(Math.abs(ratio * (width - (image.outerWidth() - image.width()))));

            image.addClass(this.options.resizingClass);

            imageLink = imageLink.html(image.attr('title') || image.attr('src').substr(image.attr('src').lastIndexOf('/') + 1)).
                    attr('href', image.attr('src'));

            // Resize the image with CSS / attributes
            $(image).css({ width: width });

            var plugin = this;
            this.showOversizeWarning(elementOuterHtml($(imageLink)), {
                hide: function() {
                    image.removeClass(plugin.options.resizingClass);
                }
            });
        }
    },

    cancel: function() {
        this.removeClasses();
        this.removeToolsButtons();
        this.unbind();
    },

    /**
     * Remove resizingClass.
     */
    save: function() {
        this.removeClasses(this.options.resizingClass);
        this.removeToolsButtons();
        this.unbind();
    },

    /**
     * Helper method for showing information about an oversized image to the user
     * @param  {anchor} imageLink link to the subject image
     * @param  {map} options options to be passed to editor.showInfo
     */
    showOversizeWarning: function(imageLink, options) {
        this.editor.showInfo(_('The image \'{{image}}\' is too large for the element being edited.<br/>It will be replaced with a resized copy when your edits are saved.', {
            image: imageLink
        }), options);
    },

    /**
     * Remove any temporary classes from the editing element's images.
     * @param  {array} classNames to be removed
     */
    removeClasses: function(classNames) {
        if (!classNames) classNames = [this.options.resizingClass, this.options.manuallyResizingClass];
        if (!$.isArray(classNames)) classNames = [classNames];
        for (var i = 0; i < classNames.length; i++) {
            this.editor.getElement().find('img.' + classNames[i]).removeClass(classNames[i]);
        }
    },

    /**
     * Display a dialog containing width / height text inputs allowing the user to manually resize the selected image.
     */
    manuallyResizeImage: function() {
        this.removeToolsButtons();
        var image = this.editor.getElement().find('img.' + this.options.manuallyResizingClass);
        var width = $(image).innerWidth(), height = $(image).innerHeight(),
            widthInputSelector = '#' + this.options.baseClass + '-width',
            heightInputSelector = '#' + this.options.baseClass + '-height',
            plugin = this;

        var updateImageSize = function(width) {
            width = Math.round((width || $(widthInputSelector).val())) + 'px';
            $(image).css({ width: width });
        };

        var dialog = $(this.editor.getTemplate('imageresize.manually-resize-image', {
            width: width,
            height: height,
            baseClass: this.options.baseClass
        }));

        dialog.dialog({
            modal: true,
            resizable: false,
            title: _('Modify Image Size'),
            autoOpen: true,
            buttons: [
                {
                    text: _('Resize Image'),
                    click: function() {
                        updateImageSize();
                        $(this).dialog('close');
                    }
                },
                {
                    text: _('Cancel'),
                    click: function() {
                        $(this).dialog('close');
                    }
                }
            ],
            close: function() {
                updateImageSize(width);
                plugin.editor.checkChange();
                $(dialog).remove();
            },
            open: function() {
                var widthInput = $(this).find(widthInputSelector);
                var heightInput = $(this).find(heightInputSelector);
                widthInput.keyup(function() {
                    heightInput.val(Math.round(Math.abs((height / width) * $(this).val())));
                    updateImageSize();
                });
                heightInput.keyup(function() {
                    widthInput.val(Math.round(Math.abs((width / height) * $(this).val())));
                    updateImageSize();
                });
            }
        });
    },

    /**
     * Create & display a 'tools' button in the top right corner of the image.
     * @param  {jQuery|Element} image The image element to display the button relative to.
     */
    displayToolsButtonRelativeToImage: function(image) {

        var resizeButton = $('<button/>')
            .appendTo('body')
            .addClass(this.options.resizeButtonClass)
            .button({
                text: false,
                icons: {
                    primary: 'ui-icon-tools'
                }
            });

        resizeButton.css({
                position: 'absolute',
                left: ($(image).position().left + $(image).innerWidth() - $(resizeButton).outerWidth() - 10) + 'px',
                marginTop: '10px'
            })
            .click($.proxy(this.manuallyResizeImage, this))

        $(image).before(resizeButton);
    },

    /**
     * Remove any tools buttons inside the editing element.
     */
    removeToolsButtons: function() {
        this.editor.getElement().find('.' + this.options.resizeButtonClass).each(function() {
            $(this).remove();
        })
    },

    /**
     * Handle the mouse enter event.
     * @param  {Event} event The event.
     */
    imageMouseEnter: function(event) {
        $(event.target).addClass(this.options.manuallyResizingClass);
        this.displayToolsButtonRelativeToImage(event.target);
    },

    /**
     * Handle the mouse leave event. If the mouse has left but the related target is a resize button,
     * do not remove the button or the manually resizing class from the image.
     * @param  {Event} event The event.
     */
    imageMouseLeave: function(event) {
        if (!$(event.relatedTarget).hasClass(this.options.resizeButtonClass)) {
            $(event.target).removeClass(this.options.manuallyResizingClass);
            this.removeToolsButtons();
        }
    }
});