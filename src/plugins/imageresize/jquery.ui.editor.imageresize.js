/**
 * @name $.editor.plugin.imageResize
 * @augments $.ui.editor.defaultPlugin
 * @class Automatically resize oversized images with CSS and height / width attributes. If {@link $.editor.plugin.options#resizeAjax} is true,
 * the plugin will make a request to the server for resized image paths.
 */
$.ui.editor.registerPlugin('imageResize', /** @lends $.editor.plugin.imageResize.prototype */ {

    options: {
        resizeAjax: false,
        resizingClass: '',
        resizeAjaxClass: '',
        ajax: {
            url: '/',
            type: 'post',
            cache: false
        }
    },

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function(editor, options) {

        this.options = $.extend(this.options, {
            resizingClass: this.options.baseClass + '-in-progress',
            resizeAjaxClass: this.options.baseClass + '-on-save'
        });

        editor.bind('enabled', this.bind, this);

        // If the function addEventListener exists, bind our custom image resized event
        this.resized = $.proxy(this.imageResized, this);
        var plugin = this;
        editor.getElement().find('img').each(function(){
            if (this.addEventListener) {
                this.addEventListener('DOMAttrModified', plugin.resized, false);
            }
            if (this.attachEvent) {  // Internet Explorer and Opera
                this.attachEvent('onpropertychange', plugin.resized);
            }
        });
    },

    /**
     * Bind events
     */
    bind: function() {
        this.editor.bind('change', this.scanImages, this);
        this.editor.bind('destroy', this.destroy, this);
        this.editor.bind('save', this.save, this);
        this.editor.bind('cancel', this.cancel, this);
    },

    /**
     * Handler simulating a 'resize' event for image elements
     * @param {Object} event
     */
    imageResized: function(event) {
        var target = $(event.target);
        if(target.is('img') &&
            target.attr('_moz_resizing') &&
            event.attrName == 'style' &&
            event.newValue.match(/width|height/)) {
            if (this.options.resizeAjax) target.addClass(this.options.resizeAjaxClass);
            this.editor.fire('change');
        }
    },

    /**
     * Check for oversize images within the editing element
     */
    scanImages: function() {
        var element = this.editor.getElement();
        var plugin = this;
        var images = [];
        $(element.find('img')).each(function() {
            if (element.height() < $(this).outerHeight() || element.width() < $(this).outerWidth()) {
                //console.log('here', element.width(), $(this).outerWidth());
                images.push($(this));
            }
        });

        if (images.length) {
            plugin.resizeImageElements(images, element.width(), element.height());
        }
    },

    /**
     * Proportionately resizes the image, applying width & height attributes and CSS styles
     * @param  {String[]} image The images to be resized
     * @param  {int} maxWidth The editing element's maximum width
     * @param  {int} maxHeight The editing element's maximum height
     */
    resizeImageElements: function(images, maxWidth, maxHeight) {

        // Prepare a link to be included in any messages
        var imageLink = $('<a>', {
            href: '',
            target: '_blank'
        });

        for (var i = 0; i < images.length; i++) {

            var image = images[i];
            var width = image.outerWidth();
            var height = image.outerHeight();
            var ratio = Math.min(maxWidth / width, maxHeight / height);

            width = Math.abs(ratio * (width - (image.outerWidth() - image.width())));
            height = Math.abs(ratio * (height - (image.outerHeight() - image.height())));

            image.addClass(this.options.resizingClass);

            imageLink = imageLink.html(image.attr('title') || image.attr('src').substr(image.attr('src').lastIndexOf('/') + 1)).
                    attr('href', image.attr('src'));

            // Resize the image with CSS / attributes
            $(image).css({
                'width': width,
                'height': height
            }).attr('height', height).
                attr('width', width);

            if (this.options.resizeAjax) {
                image.addClass(this.options.resizeAjaxClass);
            }

            var plugin = this;
            this.showOversizeWarning(this.editor.outerHtml(imageLink), {
                hide: function() {
                    image.removeClass(plugin.options.resizingClass);
                }
            });
        }
    },

    cancel: function() {
        this.removeClasses();
        this.editor.unbind('change', this.scanImages, this);
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
     * Remove any left over classes, remove event listener
     */
    destroy: function() {
        this.cancel();
    },

    /**
     * Remove resizingClass, call resizeImagesAjax if applicable
     */
    save: function() {
        this.removeClasses(this.options.resizingClass);
        if (this.options.resizeAjax) this.resizeImagesAjax();
    },

    /**
     * Send array of images to be resized to server & update the related image elements' src with that of the resized images
     */
    resizeImagesAjax: function() {
        var plugin = this;
        var images = [];

        $('.' + this.options.resizeAjaxClass).each(function(){
            if (!$(this).attr('id')) $(this).attr('id', plugin.editor.getUniqueId());
            images.push({
                id: $(this).attr('id'),
                src: this.src,
                width: $(this).width(),
                height: $(this).height()
            });
        });

        if (!images.length) return;

        var loading = this.editor.showLoading(_('Resizing image(s)'));

        // Create the JSON request
        var ajax = this.options.ajax;

        ajax.data = { images: images };
        ajax.async = false;

        $.ajax(ajax)
            .done(function(data) {
                $(data).each(function(){
                    $('#' + this.id).attr('src', this.src).removeAttr('id');
                });
                plugin.editor.fire('change');
                loading.hide();
                plugin.editor.showConfirm(_('{{images}} image(s) have been replaced with resized versions', {
                    images: images.length
                }));
            })
            .fail(function(data) {
                loading.hide();
                plugin.editor.showError(_('Failed to resize images (error {{error}})', {
                    error: data.status
                }));
            })
            .always(function(data) {
                plugin.removeClasses([
                    plugin.options.resizeAjaxClass
                ]);
            });
    },

    /**
     * Helper method for showing information about an oversized image to the user
     * @param  {anchor} imageLink link to the subject image
     * @param  {map} options options to be passed to editor.showInfo
     */
    showOversizeWarning: function(imageLink, options) {
        if (!this.options.resizeAjax) {
            this.editor.showInfo(_('The image "{{image}}" is too large for the element being edited.<br/>It has been resized with CSS.', {
                image: imageLink
            }), options);
        } else {
            this.editor.showInfo(_('The image "{{image}}" is too large for the element being edited.<br/>It will be replaced with a resized copy when your edits are saved.', {
                image: imageLink
            }), options);
        }
    },

    /**
     * Remove the given classes from any of the element's images
     * @param  {array} classNames to be removed
     */
    removeClasses: function(classNames) {
        if (!classNames) classNames = [this.options.resizingClass, this.options.resizeAjaxClass];
        if (!$.isArray(classNames)) classNames = [classNames];
        for (var i = 0; i < classNames.length; i++) {
            this.editor.getElement().find('img.' + classNames[i]).removeClass(classNames[i]);
        }
    }
});