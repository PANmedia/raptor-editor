/**
 * @fileOverview Contains the insert file button code.
 * @license http://www.raptor-editor.com/license
 *
 * @author David Neilsen <david@panmedia.co.nz>
 * @author Michael Robinson <michael@panmedia.co.nz>
 * @author Melissa Richards <melissa@panmedia.co.nz>
 */

/**
 * Creates an instance of the button class to allow the insertation of files.
 *
 * @todo param details?
 * @param {type} param
 */
Raptor.registerUi(new DialogButton({
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

    /**
     * Open the insert file dialog or file manager.
     */
    action: function(target) {
        // If a customAction has been specified, use it instead of the default dialog.
        if (!this.options.customAction || this.options.customAction.call(this, target) === false) {
            if (typeof target !== 'undefined') {
                this.getDialog().find('[name=location]').val(target.getAttribute('src') || target.getAttribute('href'));
                this.getDialog().find('[name=name]').val(target.innerHTML);
            } else {
                this.getDialog().find('[name=location]').val('');
                this.getDialog().find('[name=name]').val('');
            }
            return this.openDialog();
        }
    },

    applyAction: function() {
        var dialog = this.getDialog(),
            location = dialog.find('[name=location]').val(),
            name = dialog.find('[name=name]').val();
        this.raptor.actionApply(function() {
            this.insertFiles([{
                location: location,
                name: name
            }]);
        }.bind(this));
    },

    getDialogTemplate: function() {
        return $(this.raptor.getTemplate('insert-file.dialog'));
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
            return file.extension.toLowerCase();
        }
        var extension = file.location.split('.');
        if (extension.length > 0) {
            return extension.pop().toLowerCase();
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
        this.raptor.resume();
        if (!files.length) {
            return;
        }
        this.raptor.actionApply(function() {
            if (files.length === 1) {
                if ((this.isImage(files[0]) && $(selectionGetHtml()).is('img')) || selectionIsEmpty()) {
                    this.replaceFiles(files);
                } else {
                    this.linkFiles(files);
                }
            } else {
                this.linkFiles(files);
            }
        }.bind(this));
    },

    linkFiles: function(files) {
        selectionExpandTo('a', this.raptor.getElement());
        selectionTrim();
        var applier = rangy.createApplier({
            tag: 'a',
            attributes: {
                href: files[0].location.replace(/([^:])\/\//g, '$1/'),
                title: files[0].name,
                'class': this.options.cssPrefix + 'file ' + this.options.cssPrefix + this.getFileType(files[0])
            }
        });
        applier.applyToSelection();
    },

    replaceFiles: function(files) {
        var elements = [];
        for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
            elements.push(this.prepareElement(files[fileIndex]));
        }
        selectionReplace(elements.join(', '));
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
            src: file.location.replace(/([^:])\/\//g, '$1/'),
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
            href: file.location.replace(/([^:])\/\//g, '$1/'),
            title: file.name,
            'class': classNames
        }).html(text || file.name)).html();
    }
}));
