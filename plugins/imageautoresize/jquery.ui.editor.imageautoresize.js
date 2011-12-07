(function($) {
    
    $.ui.editor.registerPlugin('image-auto-resize', {

        warning: null,

        options: {
            /**
             * Default image resize function
             * Proportionately resizes the image, applying width & height attributes and CSS styles
             * This function is provided for completion's sake, it is intended that one will override this function with one that resizes the image server-side and replaces the image element's src with that for the resized image
             * @param  {element} image     the image to be resized
             * @param  {int} maxWidth  the editing element's maximum width
             * @param  {int} maxHeight the editing element's maximum height
             */
            resizeImage: function(image, maxWidth, maxHeight) {
                
                var width = image.outerWidth();
                var height = image.outerHeight();
                var className = this.options.baseClass + '-resizing';

                image.addClass(className);

                if (image.outerHeight() > image.outerWidth()) {
                    width = Math.floor((width / height) * maxHeight);
                    height = maxHeight;
                } else {
                    height = Math.floor((height / width) * maxWidth); 
                    width = maxWidth;
                }

                $(image).css({
                    'width': width,
                    'height': height 
                }).attr('height', height).
                    attr('width', width);


                // Tell the user about the changes
                var imageLink = this.editor.outerHtml($('<a>', {
                    href: image.attr('src'),
                    target: '_blank'
                }).html($(image).attr('title') || $(image).attr('src').substr(image.attr('src').lastIndexOf('/')+1)));
                
                this.editor.showWarning(_('The image "{{image}}" is too large for the element being edited.', {
                    image: imageLink
                }));

                this.editor.showConfirm(_('The image {{image}} has been resized with CSS.', {
                    image: imageLink
                }), {
                    hide: function() {
                        image.removeClass(className);
                    }   
                });
            }
        },

        init: function(editor, options) {
            editor.bind('change', $.proxy(this.scanImages, this));
            editor.bind('destroy', $.proxy(this.destroy, this));
        },

        /**
         * Check for oversize images within the editing element
         */
        scanImages: function() {
            
            var element = this.editor.getElement();
            var plugin = this;

            $(element.find('img')).each(function() {
                if (element.height() < $(this).outerHeight() || element.width() < $(this).outerWidth()) {
                    plugin.handleOversize.call(plugin, $(this), element.width(), element.height());
                }
            });
        },

        /**
         * Call the resizeImage function 
         * @param  {element} image the image to be resized
         * @param  {int} maxHeight the editing element's maximum height
         * @param  {int} maxWidth  the editing element's maximum width
         */
        handleOversize: function(image, maxWidth, maxHeight) {
            this.options.resizeImage.call(this, image, maxWidth, maxHeight);
        },
        
        /**
         * Remove any left over classes
         */
        destroy: function() {
            this.editor.getElement().find('img.' + this.options.baseClass + '-resizing').removeClass(this.options.baseClass + '-resizing');
        }
    });
        
})(jQuery);
