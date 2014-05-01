/**
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 */

Raptor.registerUi(new PreviewButton({
    name: 'cleanBlock',
    action: function() {
        var element = this.raptor.getElement();
        cleanRemoveAttributes(element, [
            'style'
        ]);
        cleanRemoveElements(element, [
            'font',
            'span:not([class])',
            '.cms-color:has(.cms-color)',
            ':header strong',
            ':header b',
            ':header strong'
        ]);
        cleanEmptyElements(element, [
            'b',
            'big',
            'em',
            'i',
            'small',
            'span',
            'strong',
            ':not(:visible)'
        ]);
    }
}));
