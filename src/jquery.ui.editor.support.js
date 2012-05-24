var supported, ios;

function isSupported(editor) {
    if (supported === undefined) {
        ios = /(iPhone|iPod|iPad).*AppleWebKit/i.test(navigator.userAgent);
        if (ios) {
            $('html').addClass(editor.options.baseClass + '-ios');

            // Fixed position hack
            if (ios) {
                $(document).bind('scroll', function(){
                    setInterval(function() {
                        $('body').css('height', '+=1').css('height', '-=1');
                    }, 0);
                });
            }
        }
        if ($.browser.mozilla) {
            $('html').addClass(editor.options.baseClass + '-ff');
        }
        if ($.browser.msie) {
            supported = false;

            // Create message modal
            var message = $('<div></div>')
                .addClass(editor.options.baseClass + '-unsupported')
                .html(editor.getTemplate('unsupported'))
                .appendTo('body');

            // Place ontop
            var zIndex = 1;
            message.siblings().each(function() {
                var z = $(this).css('z-index');
                if (!isNaN(z) && z > zIndex) {
                    zIndex = z + 1;
                }
            });
            message.css('z-index', zIndex);

            // Close event
            message.find('.' + editor.options.baseClass + '-unsupported-close').click(function() {
                message.remove();
            });
        } else {
            supported = true;
        }
    }
    return supported;
}