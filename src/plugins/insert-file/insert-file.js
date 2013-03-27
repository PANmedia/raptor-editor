/**
 * @fileOverview Contains the insert file button code.
 * @author  David Neilsen <david@panmedia.co.nz>
 * @author  Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates an instance of the button class to allow the insertation of files.
 *
 * @todo param details?
 * @param {type} param
 */
Raptor.registerUi(new Button({
    name: 'insertFile',
    state: false,
    /** @type {string[]} Image extensions*/
    imageTypes: [
        'jpeg',
        'jpg',
        'png',
        'gif'
    ],
    options: {
        /**
         * Save the current state, show the insert file dialog or file manager.
         *
         * @type {null|Function} Specify a function to use instead of the default
         *                       file insertion dialog.
         * @return {Boolean} False to indicate that custom action failed and the
         *                         default dialog should be used.
         */
        customAction: false
    },
    action: function() {
        this.state = this.raptor.stateSave();
        // If a customAction has been specified, use it instead of the default dialog.
        if (!this.options.customAction) {
            return this.showDialog();
        }

        if (this.options.customAction.call(this) === false) {
            return this.showDialog();
        }
    },

    /**
     * Show the insert files dialog.
     */
    showDialog: function() {
        var dialogElement = $('.file-manager-missing');
        if (!dialogElement.length) {
            dialogElement = $(this.raptor.getTemplate('insert-file.dialog'));
        }
        var self = this;
        aDialog(dialogElement, {
            title: 'No File Manager',
            modal: true,
            buttons: [
                {
                    text: _('insertFileDialogOKButton'),
                    click: function() {
                        self.insertFiles([{
                            location: dialogElement.find('input[name="location"]').val(),
                            name: dialogElement.find('input[name="name"]').val()
                        }]);
                        aDialogClose(dialogElement);
                    },
                    icons: {
                        primary: 'ui-icon-circle-check'
                    }
                },
                {
                    text: _('insertFileDialogCancelButton'),
                    click: function() {
                        aDialogClose(dialogElement);
                        self.raptor.stateRestore(self.state);
                    },
                    icons: {
                        primary: 'ui-icon-circle-close'
                    }
                }
            ],
            close: function() {
                self.raptor.restoreFocus();
            }
        });
        aDialogOpen(dialogElement);
    },

    /**
     * Attempt to determine the file type from either the file's explicitly set
     * extension property, or the file extension of the file's location property.
     *
     * @param  {Object} file
     * @return {string}
     */
    getFileType: function(file) {
        if (typeof file.extension !== 'undefined') {
            return file.extension;
        }
        var extension = file.location.split('.');
        if (extension.length > 0) {
            return extension.pop();
        }
        return 'unknown';
    },

    /**
     * @param  {Object} file
     * @return {Boolean} True if the file is an image.
     */
    isImage: function(file) {
        return $.inArray(this.getFileType(file), this.imageTypes) !== -1;
    },

    /**
     * Insert the given files. If files contains only one item, it is inserted
     * with selectionReplaceWithinValidTags using an appropriate valid tag array
     * for the file's type. If files contains more than one item, the items are
     * processed into an array of HTML strings, joined then inserted using
     * selectionReplaceWithinValidTags with a valid tag array of tags that may
     * contain both image and anchor tags.
     *
     * [
     *     {
     *         location: location of the file, e.g. http://www.raptor-editor.com/images/html5.png
     *         name: a name for the file, e.g. HTML5 Logo
     *         extension: explicitly defined extension for the file, e.g. png
     *     }
     * ]
     *
     * @param  {Object[]} files Array of files to be inserted.
     */
    insertFiles: function(files) {
        this.raptor.stateRestore(this.state);
        this.state = null;

        if (!files.length) {
            return;
        }

        var file;
        if (files.length === 1) {
            file = files.shift();

            var html = this.prepareElement(file, selectionGetHtml());

            if (this.isImage(file)) {
                selectionReplaceWithinValidTags(html, [
                    // Tags within which the <img> tag may reside
                    'acronym', 'address', 'applet', 'b', 'bdo', 'big', 'blockquote', 'body', 'caption',
                    'center', 'cite', 'code', 'dd', 'del', 'dfn', 'div', 'dt', 'em', 'fieldset', 'font',
                    'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'i', 'iframe', 'ins', 'kbd', 'label', 'legend',
                    'li', 'noframes', 'noscript', 'object', 'p', 'pre', 'q', 's', 'samp', 'small', 'span',
                    'strike', 'strong', 'sub', 'sup', 'td', 'th', 'u', 'var'
                ]);
            } else {
                selectionReplaceWithinValidTags(html, [
                    // Tags within which the <a> tag may reside
                    'a', 'abbr', 'acronym', 'address', 'applet', 'b', 'bdo', 'big', 'blockquote', 'body',
                    'button', 'caption', 'center', 'cite', 'code', 'dd', 'del', 'dfn', 'div', 'dt', 'em',
                    'fieldset', 'font', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'i', 'iframe', 'ins',
                    'kbd', 'label', 'legend', 'li', 'noframes', 'noscript', 'object', 'p', 'q', 's', 'samp',
                    'small', 'span', 'strike', 'strong', 'sub', 'sup', 'td', 'th', 'tt', 'u', 'var'
                ]);
            }
            return;
        }

        var elements = [];
        for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
            elements.push(this.prepareElement(files[fileIndex]));
        }

        selectionReplaceWithinValidTags(elements.join(', '), [
            // Tags within which both the <img> & <a> tags may reside
            'acronym', 'address', 'applet', 'b', 'bdo', 'big', 'blockquote', 'body', 'caption',
            'center', 'cite', 'code', 'dd', 'del', 'dfn', 'div', 'dt', 'em', 'fieldset', 'font',
            'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'i', 'iframe', 'ins', 'kbd', 'label',
            'legend', 'li', 'noframes', 'noscript', 'object', 'p', 'q', 's', 'samp', 'small',
            'span', 'strike', 'strong', 'sub', 'sup', 'td', 'th', 'u', 'var'
        ]);
    },

    /**
     * Prepare the HTML for either an image or an anchor tag, depending on the file's type.
     *
     * @param {Object} file
     * @param {string|null} text The text to use as the tag's title and an anchor
     *                           tag's HTML. If null, the file's name is used.
     * @return {string} The tag's HTML.
     */
    prepareElement: function(file, text) {
        if (this.isImage(file)) {
            return this.prepareImage(file, this.options.cssPrefix + this.getFileType(file), text);
        } else {
            return this.prepareAnchor(file, this.options.cssPrefix + 'file ' + this.options.cssPrefix + this.getFileType(file), text);
        }
    },

    /**
     * Prepare HTML for an image tag.
     *
     * @param  {Object} file
     * @param  {string} classNames Classnames to apply to the image tag.
     * @param  {string|null} text Text to use as the image tag's title. If null,
     *                            the file's name is used.
     * @return {string} Image tag's HTML.
     */
    prepareImage: function(file, classNames, text) {
        return $('<div/>').html($('<img/>').attr({
            src: file.location,
            title: text || file.name,
            'class': classNames
        })).html();
    },

    /**
     * Prepare HTML for an anchor tag.
     *
     * @param  {Object} file
     * @param  {string} classNames Classnames to apply to the anchor tag.
     * @param  {string|null} text Text to use as the anchor tag's title & content. If null,
     *                            the file's name is used.
     * @return {string} Anchor tag's HTML.
     */
    prepareAnchor: function(file, classNames, text) {
        return $('<div/>').html($('<a/>').attr({
            href: file.location,
            title: file.name,
            'class': classNames
        }).html(text || file.name)).html();
    }
}));
