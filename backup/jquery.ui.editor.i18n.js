/**
 * @fileOverview Internationalization UI component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */
 Raptor.registerUi({

    /**
     * @name $.editor.ui.i18n
     * @augments Raptor.defaultUi
     * @class Provides a dropdown to allow the user to switch between available localizations
     */
    i18n: /** @lends $.editor.ui.i18n.prototype */ {

        /**
         * @see Raptor.defaultUi#init
         */
        init: function(editor, options) {
            var ui = this;

            var menu = $('<select autocomplete="off" name="i18n"/>');

            for (var key in locales) {
                var option = $('<option value="' + key + '" class="' + key + '"/>');
                option.html(localeNames[key]);

                if (currentLocale === key) {
                    option.attr('selected', 'selected');
                }

                menu.append(option);
            }

            return editor.uiSelectMenu({
                title: _('Change Language'),
                select: menu,
                change: function(value) {
                    setLocale(ui.persist('locale', value));
                }
            });
        }
    }
});
