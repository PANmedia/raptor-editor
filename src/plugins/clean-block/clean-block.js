/**
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 */

Raptor.registerUi(new PreviewButton({
    name: 'cleanBlock',
    action: function() {
        this.raptor.getElement().find('[style]').removeAttr('style');
        this.raptor.getElement().find('span:empty').remove();
    }
}));
