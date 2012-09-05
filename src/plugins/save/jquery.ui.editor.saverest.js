/**
 * @fileOverview
 * @author David Neilsen david@panmedia.co.nz
 */

/**
 * @name $.editor.plugin.saverest
 * @augments $.ui.editor.defaultPlugin
 * @class
 */
$.ui.editor.registerPlugin('saveRest', /** @lends $.editor.plugin.saveRest.prototype */ {

    /**
     * @name $.editor.plugin.saveRest.options
     * @type {Object}
     * @namespace Default options
     * @see $.editor.plugin.saveRest
     */
    options: /** @lends $.editor.plugin.saveRest.options */  {

        /**
         * @default false
         * @type {Boolean}
         */
        showResponse: false,

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
    getData: function(id) {
        var data = {};
        data[this.getId() || id] = this.editor.save();
        return this.editor.save();
    },

    /**
     * Perform save.
     */
    save: function() {
        this.message = this.editor.showLoading(_('Saving changes...'));

        // Count the number of requests
        this.saved = 0;
        this.failed = 0;
        this.requests = 0;

        // Get all unified content
        var dirty = 0;
        this.editor.unify(function(editor) {
            if (editor.isDirty()) {
                dirty++;
                var plugin = editor.getPlugin('saveRest');
                var content = plugin.editor.save();
                plugin.ajax(content);
            }
        });
        this.dirty = dirty;

        if (dirty === 0) {
            this.message.hide();
            this.editor.showInfo(_('No changes detected to save...'));
        }
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
        // Create POST data
        //var data = {};

        // Content is serialized to a JSON object, and sent as 1 post parameter
        //data[this.options.postName] = JSON.stringify(contentData);

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
