var supported, ios, hotkeys, firefox, ie;

function isSupported() {
    if (supported === undefined) {
        supported = true;

        // <ios>
        ios = /(iPhone|iPod|iPad).*AppleWebKit/i.test(navigator.userAgent);
        if (ios) {
            $('html').addClass('raptor-ios');

            // Fixed position hack
            if (ios) {
                $(document).on('scroll', function(){
                    setInterval(function() {
                        $('body').css('height', '+=1').css('height', '-=1');
                    }, 0);
                });
            }
        }
        // </ios>

        firefox = /Firefox/i.test(navigator.userAgent);
        if (firefox) {
            $('html').addClass('raptor-ff');
        }

        // <ie>
        /**
         * Returns the version of Internet Explorer or a -1 (indicating the use of another browser).
         * http://obvcode.blogspot.co.nz/2007/11/easiest-way-to-check-ie-version-with.html
         */
        var ieVersion = (function() {
            var version = -1;
            if (navigator.appVersion.indexOf("MSIE") != -1) {
                version = parseFloat(navigator.appVersion.split("MSIE")[1]);
            }
            return version;
        })();

        ie = ieVersion !== -1;
        if (ie && ieVersion < 9) {
            supported = false;

            // Create message modal
            $(function() {
                var message = $('<div/>')
                    .addClass('raptor-unsupported')
                    .html(
                        '<div class="raptor-unsupported-overlay"></div>' +
                        '<div class="raptor-unsupported-content">' +
                        '    It has been detected that you a using a browser that is not supported by Raptor, please' +
                        '    use one of the following browsers:' +
                        '    <ul>' +
                        '        <li><a href="http://www.google.com/chrome">Google Chrome</a></li>' +
                        '        <li><a href="http://www.firefox.com">Mozilla Firefox</a></li>' +
                        '        <li><a href="http://windows.microsoft.com/ie">Internet Explorer</a></li>' +
                        '    </ul>' +
                        '    <div class="raptor-unsupported-input">' +
                        '        <button class="raptor-unsupported-close">Close</button>' +
                        '        <input name="raptor-unsupported-show" type="checkbox" />' +
                        '        <label>Don\'t show this message again</label>' +
                        '    </div>' +
                        '<div>'
                    )
                    .appendTo('body');

                /**
                 * Sets the z-index CSS property on an element to 1 above all its sibling elements.
                 *
                 * @param {jQuery} element The jQuery element to have it's z index increased.
                 */
                var elementBringToTop = function(element) {
                    var zIndex = 1;
                    element.siblings().each(function() {
                        var z = $(this).css('z-index');
                        if (!isNaN(z) && z > zIndex) {
                            zIndex = z + 1;
                        }
                    });
                    element.css('z-index', zIndex);
                }
                elementBringToTop(message);

                // Close event
                message.find('.raptor-unsupported-close').click(function() {
                    message.remove();
                });
            });
        }
        // </ie>

        hotkeys = jQuery.hotkeys !== undefined;
    }
    return supported;
}

// <ie>

/**
 * Object.create polyfill
 * https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
 */
if (!Object.create) {
    Object.create = function (o) {
        if (arguments.length > 1) {
            throw new Error('Object.create implementation only accepts the first parameter.');
        }
        function F() {}
        F.prototype = o;
        return new F();
    };
}

/**
 * Node.TEXT_NODE polyfill
 */
if (typeof Node === 'undefined') {
    Node = {
        TEXT_NODE: 3
    };
}

/**
 * String.trim polyfill
 * https://gist.github.com/eliperelman/1035982
 */
''.trim || (String.prototype.trim = // Use the native method if available, otherwise define a polyfill:
    function () { // trim returns a new string (which replace supports)
        return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,'') // trim the left and right sides of the string
    });

// </ie>

// <strict>

// Ensure jQuery has been included
if (typeof jQuery === 'undefined') handleError('jQuery is required');

// Ensure jQuery UI has been included
else if (!jQuery.ui) handleError('jQuery UI is required');

// Ensure dialog has been included
else if (!jQuery.ui.dialog) handleError('jQuery UI Dialog is required.');

// Ensure dialog has been included
else if (!jQuery.ui.position) handleError('jQuery UI Position is required.');

// Ensure rangy has been included
if (typeof rangy === 'undefined') handleError('Rangy is required. This library should have been included with the file you downloaded. If not, acquire it here: http://code.google.com/p/rangy/"');


function versionCompare(v1, v2) {
    var v1parts = v1.split('.');
    var v2parts = v2.split('.');

    for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length == i) {
            return v1;
        }
        var v1int = parseInt(v1parts[i]);
        var v2int = parseInt(v2parts[i]);

        if (v1int == v2int) {
            continue;
        }
        else if (v1int > v2int) {
            return v1;
        }
        else {
            return v2;
        }
    }

    if (v1parts.length != v2parts.length) {
        return v2;
    }

    return null;
}
var jQueryVersion = versionCompare('1.9.0', jQuery.fn.jquery);
if (jQueryVersion === '1.9.0') {
    handleError('jQuery version should be at least 1.9.0');
}
var jQueryUIVersion = versionCompare('1.10.0', jQuery.ui.version);
if (jQueryUIVersion === '1.10.0') {
    handleError('jQuery UI version should be at least 1.9.0');
}
// </strict>