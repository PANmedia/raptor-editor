/**
 * @name $.editor.plugin.imageResize
 * @augments $.ui.editor.defaultPlugin
 * @class Automatically resize oversized images with CSS and height / width attributes. If {@link $.editor.plugin.options#resizeAjax} is true,
 * the plugin will make a request to the server for resized image paths.
 */
$.ui.editor.registerPlugin('imageResize', /** @lends $.editor.plugin.imageResize.prototype */ {

    options: {
        resizeAjax: false,
        resizeInProgressClass: '',
        resizeAjaxClass: '',
        resizeHoverClass: '',
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
        
        // <strict>
        // Ensure jQuery Event Drag has been included
        if (!$.isFunction($.fn.drag)) {
            handleError(_('jquery.ui.editor.imageResize requires jQuery Event Drag - http://threedubmedia.com/code/event/drag'));
            return;
        }
        // </strict>

        this.options = $.extend(this.options, {
            resizeInProgressClass: this.options.baseClass + '-in-progress',
            resizeAjaxClass: this.options.baseClass + '-on-save',
            resizeHoverClass: this.options.baseClass + '-hover'
        });

        editor.bind('enabled', this.bind, this);
    },

    /**
     * Bind events
     */
    bind: function() {
        this.scanImages();
        this.editor.bind('change', this.scanImages, this);
        this.editor.bind('destroy', this.destroy, this);
        this.editor.bind('save', this.save, this);
        this.editor.bind('cancel', this.cancel, this);
    },

    unbind: function() {
        $(this.editor.getElement().find('img')).unbind('mouseup.imageresize drag.imageresize dragstart.imageresize mousemove.imageresize mouseover.imageresize');
    },

    parseDirection: function(event, element) {
        var x = event.pageX - $(element).offset().left;
        var y = event.pageY - $(element).offset().top;
        
        var direction = [];
        var handle = 8;

        // if (y < handle) {
        //     direction.push('n');
        // } else
        if(y > $(element).height() - handle) {
            direction.push('s');
        }

        // if (x < handle) {
        //     direction.push('w');
        // } else
        if(x > $(element).width() - handle) {
            direction.push('e');
        }

        return direction;
    },

    /**
     * Check for oversize images within the editing element
     */
    scanImages: function() {
        var element = this.editor.getElement();
        var editor = this.editor;
        var plugin = this;
        var images = [];

        $(element.find('img')).each(function() {
            // Image is oversize, automatically resize it
            if (element.height() < $(this).outerHeight() || element.width() < $(this).outerWidth()) {
                images.push($(this));
            }
            plugin.bindImageEvents(this);
        });

        if (images.length) {
            plugin.resizeImageElements(images, element.width(), element.height());
        }
    },

    bindImageEvents: function(image) {
        
        var plugin = this;
        var editor = this.editor;
        var options = this.options;

        $(image).bind('mouseover.imageresize', function() {
            $(this).addClass(options.resizeHoverClass);
        });
        $(image).bind('mouseout.imageresize', function() {
            $(this).removeClass(options.resizeHoverClass);
        });

        $(image).bind('mousemove.imageresize', function(event){
            
            var direction = plugin.parseDirection(event, this);

            var cursor = '';

            if (direction.length) {
                cursor = direction.join('') + '-resize';
            } else {
                cursor = 'default';
            }

            $(this).css({ cursor: cursor });
        });

        $(image).bind('dragstart.imageresize', function(event) {
            event.preventDefault();
        });

        $(image).bind('drag.imageresize', function(event) {
            event.preventDefault();

            var direction = plugin.parseDirection(event, this);
            
            if (direction.length) {
                $(this).addClass(options.resizeInProgressClass);

                var dimensions = {
                    width: $(this).width(),
                    height: $(this).height()
                };

                if ($.inArray('e', direction) !== -1 || $.inArray('w', direction) !== -1) {
                    dimensions.width = Math.round(event.pageX - $(this).offset().left);
                }
                if ($.inArray('n', direction) !== -1 || $.inArray('s', direction) !== -1) {
                    dimensions.height = Math.round(Math.abs($(this).offset().top - event.pageY));
                }

                $(this).css(dimensions).attr('width', dimensions.width).attr('height', dimensions.height);

                if (plugin.options.resizeAjax) {
                    $(this).addClass(plugin.options.resizeAjaxClass);
                }
            }
        });

        $(image).bind('mouseup.imageresize', function(event) {
            $(this).removeClass(options.resizeInProgressClass);
            editor.fire('change');
        });
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

            var width = image.width();
            var height = image.height();
            var ratio = Math.min(maxWidth / width, maxHeight / height);

            width = ratio * width;
            height = ratio * height;

            image.addClass(this.options.resizeInProgressClass);

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
                    image.removeClass(plugin.options.resizeInProgressClass);
                }
            });
        }
    },
    
    clean: function() {
        var options = this.options;
        this.editor.getElement().find('img').each(function(){
            $(this).removeClass([options.resizeAjaxClass, options.resizeHoverClass, options.resizeInProgressClass].join(' '))
                .css({'cursor': ''});
        });
    },

    cancel: function() {
        this.clean();
        this.editor.unbind('change', this.scanImages, this);
    },

    /**
     * Remove any left over classes, remove event listener
     */
    destroy: function() {
        this.cancel();
    },

    /**
     * Remove resizeInProgressClass, call resizeImagesAjax if applicable
     */
    save: function() {
        if (this.options.resizeAjax) {
            this.resizeImagesAjax();
        }
        this.clean();
        this.unbind();
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

        if (!images.length) {
            return;
        }

        var loading = this.editor.showLoading(_('Resizing image(s)'));

        // Create the JSON request
        var ajax = this.options.ajax;

        ajax.data = { images: images };
        ajax.async = false;

        $.ajax(ajax)
            .done(function(data) {
                $(data).each(function(){
                    $('#' + this.id).attr('src', this.src).removeAttr('id').removeClass(plugin.options.resizeAjaxClass);
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
            .always(function(data) {});
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
    }

});