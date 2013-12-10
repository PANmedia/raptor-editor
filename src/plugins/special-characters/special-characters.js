/**
 * @fileOverview Contains the special characters button code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

var insertCharacter = false;

/**
 * Creates an instance of the button class to insert special characters.
 */
Raptor.registerUi(new DialogButton({
    name: 'specialCharacters',
    dialogOptions: {
        width: 645
    },
    options: {
        setOrder: [
            'symbols',
            'mathematics',
            'arrows',
            'greekAlphabet'
        ],
        /**
         * Character sets available for display. From {@link http://turner.faculty.swau.edu/webstuff/htmlsymbols.html}
         */
        characterSets: {
            symbols: {
                name: tr('specialCharactersSymbols'),
                characters: [
                    ['<', '&lt;', 'less than'],
                    ['>', '&gt;', 'greater than'],
                    ['&', '&amp;', 'ampersand'],
                    ['"', '&quot;', 'quotation mark'],
                    ['&nbsp;', 'non-breaking space: \' \''],
                    ['&emsp;', 'em space: \'  \''],
                    ['&ensp;', 'en space: \' \''],
                    ['&thinsp;', 'thin space: \'\''],
                    ['&mdash;', 'em dash'],
                    ['&ndash;', 'en dash'],
                    ['&minus;', 'minus'],
                    ['-', 'hyphen'],
                    ['&oline;', 'overbar space'],
                    ['&cent;', 'cent'],
                    ['&pound;', 'pound'],
                    ['&euro;', 'euro'],
                    ['&sect;', 'section'],
                    ['&dagger;', 'dagger'],
                    ['&Dagger;', 'double dagger'],
                    ['&lsquo;', 'left single quotes'],
                    ['&rsquo;', 'right single quotes'],
                    ['\'', 'single quotes'],
                    ['&#x263a;', 'smiley face'],
                    ['&#x2605;', 'black star'],
                    ['&#x2606;', 'white star'],
                    ['&#x2610;', 'check box'],
                    ['&middot;', 'middle dot'],
                    ['&bull;', 'bullet'],
                    ['&copy;', 'copyright'],
                    ['&reg;', 'registered'],
                    ['&trade;', 'trade'],
                    ['&iquest;', 'inverted question mark'],
                    ['&iexcl;', 'inverted exclamation mark'],
                    ['&Aring;', 'Angström'],
                    ['&hellip;', 'ellipsis'],
                    ['&#x2295;', 'earth'],
                    ['&#x2299;', 'sun'],
                    ['&#x2640;', 'female'],
                    ['&#x2642;', 'male'],
                    ['&clubs;', 'clubs or shamrock'],
                    ['&spades;', 'spades'],
                    ['&hearts;', 'hearts or valentine'],
                    ['&diams;', 'diamonds'],
                    ['&loz;', 'diamond']
                ]
            },
            mathematics: {
                name: tr('specialCharactersMathematics'),
                characters: [
                    ['&lt;', 'less than'],
                    ['&le;', 'less than or equal to'],
                    ['&gt;', 'greater than'],
                    ['&ge;', 'greater than or equal to'],
                    ['&ne;', 'not equal'],
                    ['&asymp;', 'approximately equal to'],
                    ['&equiv;', 'identically equal to'],
                    ['&cong;', 'congruent to'],
                    ['&prop;', 'proportional'],
                    ['&there4;', 'therefore'],
                    ['&sum;', 'summation'],
                    ['&prod;', 'product'],
                    ['&prime;', 'prime or minutes'],
                    ['&Prime;', 'double prime or seconds'],
                    ['&Delta;', 'delta'],
                    ['&nabla;', 'del'],
                    ['&part;', 'partial'],
                    ['&int;', 'integral'],
                    ['&middot;', 'middle dot'],
                    ['&sdot;', 'dot operator'],
                    ['&bull;', 'bullet'],
                    ['&minus;', 'minus sign'],
                    ['&times;', 'multipllcation sign'],
                    ['&divide;', 'division sign'],
                    ['&frasl;', 'fraction slash, (ordinary / \\)'],
                    ['&plusmn;', 'plus or minus'],
                    ['&deg;', 'degree sign'],
                    ['&lfloor;', 'floor function'],
                    ['&rfloor;', 'floor function'],
                    ['&lceil;', 'ceiling function'],
                    ['&rceil;', 'ceiling function'],
                    ['&lowast;', 'asterisk operator, (ordinary *)'],
                    ['&oplus;', 'circled plus'],
                    ['&otimes;', 'circled times'],
                    ['&ordm;', 'masculine ordinal'],
                    ['&lang;', 'bra'],
                    ['&rang;', 'ket'],
                    ['&infin;', 'infinity'],
                    ['&pi;', 'pi'],
                    ['&frac12;', 'half'],
                    ['&alefsym;', 'aleph'],
                    ['&radic;', 'radical'],
                    ['&ang;', 'angle'],
                    ['&perp;', 'perpendicular'],
                    ['&real;', 'real'],
                    ['&isin;', 'is an element of'],
                    ['&notin;', 'not an element of'],
                    ['&empty;', 'null set'],
                    ['&sub;', 'subset of'],
                    ['&sube;', 'subset or or equal to'],
                    ['&nsub;', 'not a subset'],
                    ['&cap;', 'intersection'],
                    ['&cup;', 'union'],
                    ['&sim;', 'tilde operator (ordinary ~)'],
                    ['&Oslash;', 'slash O'],
                    ['&and;', 'logical and'],
                    ['&Lambda;', 'lambda (and)'],
                    ['&or;', 'logical or'],
                    ['&not;', 'not sign'],
                    ['&sim;', 'tilde operator (ordinary ~)'],
                    ['&rarr;', 'right arrow'],
                    ['&rArr;', 'double right arrow'],
                    ['&larr;', 'left arrow'],
                    ['&lArr;', 'left double arrow'],
                    ['&harr;', 'left right arrow'],
                    ['&hArr;', 'left right double arrow']
                ]
            },
            arrows: {
                name: tr('specialCharactersArrows'),
                characters: [
                    ['&darr;', 'down arrow'],
                    ['&dArr;', 'down double arrow'],
                    ['&uarr;', 'up arrow'],
                    ['&uArr;', 'up double arrow'],
                    ['&crarr;', 'arriage return arrow'],
                    ['&rarr;', 'right arrow'],
                    ['&rArr;', 'double right arrow'],
                    ['&larr;', 'left arrow'],
                    ['&lArr;', 'left double arrow'],
                    ['&harr;', 'left right arrow'],
                    ['&hArr;', 'left right double arrow']
                ]
            },
            greekAlphabet: {
                name: tr('specialCharactersGreekAlphabet'),
                characters: [
                    ['&alpha;', 'alpha'],
                    ['&beta;', 'beta'],
                    ['&gamma;', 'gamma'],
                    ['&delta;', 'delta'],
                    ['&epsilon;', 'epsilon'],
                    ['&zeta;', 'zeta'],
                    ['&eta;', 'eta'],
                    ['&theta;', 'theta'],
                    ['&iota;', 'iota'],
                    ['&kappa;', 'kappa'],
                    ['&lambda;', 'lambda'],
                    ['&mu;', 'mu'],
                    ['&nu;', 'nu'],
                    ['&xi;', 'xi'],
                    ['&omicron;', 'omicron'],
                    ['&pi;', 'pi'],
                    ['&rho;', 'rho'],
                    ['&sigma;', 'sigma'],
                    ['&tau;', 'tau'],
                    ['&upsilon;', 'upsilon'],
                    ['&phi;', 'phi'],
                    ['&chi;', 'chi'],
                    ['&psi;', 'psi'],
                    ['&omega;', 'omega'],
                    ['&Alpha;', 'alpha'],
                    ['&Beta;', 'beta'],
                    ['&Gamma;', 'gamma'],
                    ['&Delta;', 'delta'],
                    ['&Epsilon;', 'epsilon'],
                    ['&Zeta;', 'zeta'],
                    ['&Eta;', 'eta'],
                    ['&Theta;', 'theta'],
                    ['&Iota;', 'iota'],
                    ['&Kappa;', 'kappa'],
                    ['&Lambda;', 'lambda'],
                    ['&Mu;', 'mu'],
                    ['&Nu;', 'nu'],
                    ['&Xi;', 'xi'],
                    ['&Omicron;', 'omicron'],
                    ['&Pi;', 'pi'],
                    ['&Rho;', 'rho'],
                    ['&Sigma;', 'sigma'],
                    ['&Tau;', 'tau'],
                    ['&Upsilon;', 'upsilon'],
                    ['&Phi;', 'phi'],
                    ['&Chi;', 'chi'],
                    ['&Psi;', 'psi'],
                    ['&Omega;', 'omega']
                ]
            }
        }
    },

    applyAction: function(dialog) {
        this.raptor.actionApply(function() {
            if (insertCharacter) {
                selectionReplace(insertCharacter);
            }
            insertCharacter = false;
        });
    },

    /**
     * Prepare tabs and add buttons to tab content.
     *
     * @return {Element}
     */
    getDialogTemplate: function() {
        var html = $(this.raptor.getTemplate('special-characters.dialog')).appendTo('body').hide();
        var setKey, tabContent, character, characterButton;
        for (var setOrderIndex = 0; setOrderIndex < this.options.setOrder.length; setOrderIndex++) {
            setKey = this.options.setOrder[setOrderIndex];

            html.find('ul').append(this.raptor.getTemplate('special-characters.tab-li', {
                baseClass: this.options.baseClass,
                name: this.options.characterSets[setKey].name,
                key: setKey
            }));

            tabContent = $(this.raptor.getTemplate('special-characters.tab-content', {
                baseClass: this.options.baseClass,
                key: setKey
            }));
            var tabCharacters = [];
            for (var charactersIndex = 0; charactersIndex < this.options.characterSets[setKey].characters.length; charactersIndex++) {
                character = this.options.characterSets[setKey].characters[charactersIndex];
                characterButton = this.raptor.getTemplate('special-characters.tab-button', {
                    htmlEntity: character[0],
                    description: character[1],
                    setKey: setKey,
                    charactersIndex: charactersIndex
                });
                tabCharacters.push(characterButton);
            }
            tabContent.append(tabCharacters.join(''));
            html.find('ul').after(tabContent);
        }
        html.show();

        var _this = this;
        html.find('button').each(function() {
            aButton($(this));
        }).click(function() {
            var setKey = $(this).attr('data-setKey');
            var charactersIndex = $(this).attr('data-charactersIndex');
            insertCharacter = _this.options.characterSets[setKey].characters[charactersIndex][0];
            _this.getOkButton(_this.name).click.call(this);
        });
        aTabs(html);
        return html;
    },

    getCancelButton: function() {
        return;
    }
}));
