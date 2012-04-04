/**
 * @fileOverview Incredible jQuery Raptor logo and usage statistics tracking
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */
$.ui.editor.registerUi({

    /**
     * @name $.editor.ui.logo
     * @augments $.ui.editor.defaultUi
     * @class Displays an <em>amazing</em> jQuery Raptor logo, providing your users with both shock and awe.
     * <br/>
     * Links back to the jQuery Raptor home page
     */
    logo: /** @lends $.editor.ui.logo.prototype */ {

        ui: null,

        /**
         * @see $.ui.editor.defaultUi#init
         */
        init: function(editor, options) {

            this.editor.bind('ready', $.proxy(this.enable, this));

            this.ui = this.editor.uiButton({
                title: _('Learn More About the jQuery Raptor WYSIWYG Editor'),
                click: function() {
                    window.open('http://www.jquery-raptor.com/about/editors/', '_blank');
                }
            });

            return this.ui;
        },

        enable: function() {

            var serializeJSON = function(obj) {
                var t = typeof(obj);
                if(t != "object" || obj === null) {
                    // simple data type
                    if(t == "string") obj = '"' + obj + '"';
                    return String(obj);
                } else {
                    // array or object
                    var json = [], arr = (obj && $.isArray(obj));

                    $.each(obj, function(k, v) {
                        t = typeof(v);
                        if(t == "string") v = '"' + v + '"';
                        else if (t == "object" & v !== null) v = serializeJSON(v);
                        json.push((arr ? "" : '"' + k + '":') + String(v));
                    });

                    return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
                }
            };

            var data = {
                'enableUi': this.options.enableUi,
                'enablePlugins': this.options.enablePlugins,
                'disabledPlugins': serializeJSON(this.options.disabledPlugins),
                'ui': serializeJSON(this.options.ui),
                't': new Date().getTime()
            };

            var query = [];
            $.each(data, function(i) {
                query.push(i + '=' + encodeURIComponent(data[i]));
            });

            this.ui.button.find('.ui-button-icon-primary').css({
                'background-image': 'url(http://www.jquery-raptor.com/logo/VERSION?' + query.join('&') + ')'
            });
        }
    }
});
