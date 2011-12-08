/**
 * @name $.editor.plugin.imageAutoResize
 * @class
 */
$.ui.editor.registerPlugin('imageAutoResize', {

    options: {
        resizeAjax: true,
        resizingClass: '',
        resizeAjaxClass: '',
        ajax: {
            url: '/',
            type: 'post',
            cache: false
        }
    },

    init: function(editor, options) {
        this.options = $.extend(this.options, {
            resizingClass: this.options.baseClass + '-in-progress',
            resizeAjaxClass: this.options.baseClass + '-on-save'
        });
        
        editor.bind('change', $.proxy(this.scanImages, this));
        editor.bind('destroy', $.proxy(this.destroy, this));
        editor.bind('save', $.proxy(this.save, this));

        // If the function addEventListener exists, bind our custom image resized event
        editor.getElement().find('img').each(function(){
            var plugin = this;
            if (this.addEventListener) {
                this.addEventListener('DOMAttrModified', $.proxy(plugin.imageResized, plugin), false);
            }
            if (this.attachEvent) {  // Internet Explorer and Opera
                elemToCheck.attachEvent('onpropertychange', $.proxy(plugin.imageResized, plugin));
            }
        });
    },

    /**
     * Handler simulating a 'resize' event for image elements
     * @param  {object} event
     */
    imageResized: function(event) {
        var target = $(event.target);
        if(target.is('img') /*&& target.attr('_moz_resizing')*/ && event.attrName == 'style' && event.newValue.match(/width|height/)) {
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
                images.push($(this));
            }
        });

        if (images.length) plugin.resizeImageElements(images, element.width(), element.height());
    },
    
    /**
     * Proportionately resizes the image, applying width & height attributes and CSS styles
     * @param  {array} images     the images to be resized
     * @param  {int} maxWidth  the editing element's maximum width
     * @param  {int} maxHeight the editing element's maximum height
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

            if (image.outerHeight() > image.outerWidth()) {
                width = Math.floor((width / height) * maxHeight);
                height = maxHeight;
            } else {
                height = Math.floor((height / width) * maxWidth); 
                width = maxWidth;
            }

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

    /**
     * Remove any left over classes, remove event listener
     */
    destroy: function() {
        this.removeClasses([
            this.options.resizingClass,
            this.options.resizeAjaxClass
        ]);
        this.editor.getElement().find('img').each(function(){
            var plugin = this;
            if (this.removeEventListener) {
                this.addEventListener('DOMAttrModified', $.proxy(plugin.imageResized, plugin), false);
            }
            if (this.detachEvent) {
                this.detachEvent('onpropertychange', $.proxy(plugin.imageResized, plugin));
            }
        });
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
                src: plugin.absoluteUrl($(this).attr('src')),
                width: $(this).width(),
                height: $(this).height()
            });
        });
        
        if (!images.length) return;

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
                plugin.editor.showConfirm(_('{{images}} image(s) have been replaced with resized versions', {
                    images: images.length
                }));
            })
            .fail(function(data) {
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
        if (!$.isArray(classNames)) classNames = [classNames];
        for (var i = 0; i < classNames.length; i++) {
            this.editor.getElement().find('img.' + classNames[i]).removeClass(classNames[i]);
        }
    },

    /**
     * Attempt to convert an uri to be root relative
     * @param  {string} url 
     * @return {string} the absolute url
     */
    absoluteUrl: function(url) {
        if (/^\w+:/.test(url)) {
            return url;
        }
        fullHost = location.protocol + '//' + location.host;
        if (url.indexOf('/') == 0) {
            return fullHost + url;
        }
        pathname = location.pathname.replace(/\/[^\/]*$/, '');
        file = url.match(/\.\.\//g);
        if (file) {
            url = url.substring(file.length * 3);
            for (i = file.length; i--;) {
                pathname = pathname.substring(0, pathname.lastIndexOf('/'));
            }
        }
        return fullHost + pathname + '/' + url;
    }
});