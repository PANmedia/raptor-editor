/**
 * @fileOverview Save plugin & ui component
 * @author David Neilsen david@panmedia.co.nz
 * @author Michael Robinson michael@panmedia.co.nz
 */

/**
 * @name $.editor.plugin.saveJson
 * @augments $.ui.editor.defaultPlugin
 * @class Provides an interface for saving the element's content via AJAX. For options see {@link $.editor.plugin.saveJson.options}
 */
$.ui.editor.registerPlugin('saveJson', /** @lends $.editor.plugin.saveJson.prototype */ {

    /**
     * @name $.editor.plugin.saveJson.options
     * @type {Object}
     * @namespace Default options
     * @see $.editor.plugin.saveJson
     */
    options: /** @lends $.editor.plugin.saveJson.options */  {

        /**
         * @type {Object}
         * @default <tt>{ attr: "name" }</tt>
         */
        id: { attr: 'name' },

        /**
         * @type {String}
         * @default "content"
         */
        postName: 'content',

        /**
         * @default false
         * @type {Boolean}
         */
        showResponse: false,

        /**
         * @default false
         * @type {Boolean}
         */
        appendId: false,

        /**
         * @default <tt>{
         *    url: '/',
         *    type: 'post',
         *    cache: false
         * }</tt>
         * @type {Object}
         */
        ajax: {
            url: '/',
            type: 'post',
            cache: false
        }
    },

    /**
     * @see $.ui.editor.defaultPlugin#init
     */
    init: function() {
    },

    /**
     * Get the identifier for this element
     * @return {String} The identifier
     */
    getId: function() {
        if (typeof(this.options.id) === 'string') {
            return this.options.id;
        } else if (typeof(this.options.id) === 'function') {
            return this.options.id.apply(this, [this.editor.getOriginalElement()]);
        } else if (this.options.id.attr) {
            // Check the ID attribute exists on the content block
            var id = this.editor.getOriginalElement().attr(this.options.id.attr);
            if (id) {
                return id;
            }
        }
        return null;
    },

    /**
     * Get the cleaned content for the element.
     * @param {String} id ID to use if no ID can be found.
     * @return {String}
     */
    getData: function() {
        var data = {};
        data[this.getId()] = this.editor.save();
        return data;
    },

    /**
     * Perform save.
     */
    save: function() {
        this.message = this.editor.showLoading(_('Saving changes...'));

        // Get all unified content
        var contentData = {};
        var dirty = 0;
        this.editor.unify(function(editor) {
            if (editor.isDirty()) {
                dirty++;
                var plugin = editor.getPlugin('saveJson');
                $.extend(contentData, plugin.getData());
            }
        });
        this.dirty = dirty;

        // Count the number of requests
        this.saved = 0;
        this.failed = 0;
        this.requests = 0;

        // Pass all content at once
        this.ajax(contentData);
    },

    /**
     * @param {Object} data Data returned from server
     */
    done: function(data) {
        if (this.options.multiple) {
            this.saved++;
        } else {
            this.saved = this.dirty;
        }
        if (this.options.showResponse) {
            this.editor.showConfirm(data, {
                delay: 1000,
                hide: function() {
                    this.editor.unify(function(editor) {
                        editor.disableEditing();
                        editor.hideToolbar();
                    });
                }
            });
        }
    },

    /**
     * Called if a save AJAX request fails
     * @param  {Object} xhr
    */
    fail: function(xhr) {
        if (this.options.multiple) {
            this.failed++;
        } else {
            this.failed = this.dirty;
        }
        if (this.options.showResponse) {
            this.editor.showError(xhr.responseText);
        }
    },

    /**
     * Called after every save AJAX request
     */
    always: function() {
        if (this.dirty === this.saved + this.failed) {
            if (!this.options.showResponse) {
                if (this.failed > 0 && this.saved === 0) {
                    this.editor.showError(_('Failed to save {{failed}} content block(s).', this));
                } else if (this.failed > 0) {
                    this.editor.showError(_('Saved {{saved}} out of {{dirty}} content blocks.', this));
                } else {
                    this.editor.showConfirm(_('Successfully saved {{saved}} content block(s).', this), {
                        delay: 1000,
                        hide: function() {
                            this.editor.unify(function(editor) {
                                editor.disableEditing();
                                editor.hideToolbar();
                            });
                        }
                    });
                }
            }

            // Hide the loading message
            this.message.hide();
            this.message = null;
        }
    },

    /**
     * Handle the save AJAX request(s)
     * @param  {String} contentData The element's content
     * @param  {String} id Editing element's identfier
     */
    ajax: function(contentData, id) {

        // Create the JSON request
        var ajax = $.extend(true, {}, this.options.ajax);

        if ($.isFunction(ajax.data)) {
            ajax.data = ajax.data.apply(this, [id, contentData]);
        } else if (this.options.postName) {
            ajax.data = {};
            ajax.data[this.options.postName] = JSON.stringify(contentData);
        }

        // Get the URL, if it is a callback
        if ($.isFunction(ajax.url)) {
            ajax.url = ajax.url.apply(this, [id]);
        }

        // Send the data to the server
        this.requests++;
        $.ajax(ajax)
            .done($.proxy(this.done, this))
            .fail($.proxy(this.fail, this))
            .always($.proxy(this.always, this));
    }

});
