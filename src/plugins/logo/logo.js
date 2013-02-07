/**
 * @fileOverview Contains the logo button code.
 * @author  David Neilsen <david@panmedia.co.nz>
 * @author  Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates a new instance of the button class to display the raptor logo and
 * link to the raptor version page.
 *
 * @todo param details?
 * @param {type} param
 */
Raptor.registerUi(new Button({
    name: 'logo',
    init: function() {
        var button = Button.prototype.init.apply(this, arguments);

        button.find('.ui-button-icon-primary').css({
            'background-image': 'url(http://www.raptor-editor.com/logo/VERSION?json=' +
                encodeURIComponent(JSON.stringify(this.raptor.options)) + ')'
        });

        return button;
    },
    action: function() {
        window.open('http://www.raptor-editor.com/about/VERSION', '_blank');
    }
}));
