/**
 * @fileOverview Contains the logo button code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates a new instance of the button class to display the raptor logo and
 * link to the raptor version page.
 */
Raptor.registerUi(new Button({
    name: 'logo',
    // <usage-statistics>
    init: function() {
        var button = Button.prototype.init.apply(this, arguments);
        button.find('.ui-button-icon-primary').css({
            'background-image': 'url(//www.raptor-editor.com/logo/VERSION?json=' +
                encodeURIComponent(JSON.stringify(this.raptor.options)) + ')'
        });
        return button;
    },
    // </usage-statistics>
    action: function() {
        window.open('http://www.raptor-editor.com/about/VERSION', '_blank');
    }
}));
