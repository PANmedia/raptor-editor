Raptor.registerLayout('toolbar', {
    options: {
        /**
         * Each element of the uiOrder should be an array of UI which will be grouped.
         */
        uiOrder: null
    },

    setDefaultUIOrder: function() {

    },

    init: function(editor, options) {
        // Load all UI components if not supplied
        if (!options.uiOrder) {
            options.uiOrder = [[]];
            for (var name in Raptor.ui) {
                options.uiOrder[0].push(name);
            }
        }

        // <debug>
        if (debugLevel >= MID) debug('Loading toolbar', editor.getElement());
        // </debug>

        var toolbar = this.toolbar = $('<div/>')
            .addClass(this.options.baseClass + '-toolbar');
        var toolbarWrapper = this.toolbarWrapper = $('<div/>')
            .addClass(this.options.baseClass + '-toolbar-wrapper')
            .addClass('ui-widget-content')
            .mousedown(function(event) {
                event.preventDefault();
            })
            .append(toolbar);
        var path = this.path = $('<div/>')
            .addClass(this.options.baseClass + '-path')
            .addClass('ui-widget-header');
        var wrapper = this.wrapper = $('<div/>')
            .addClass(this.options.baseClass + '-wrapper')
            .css('display', 'none')
            .append(path)
            .append(toolbarWrapper);

        if ($.fn.draggable && this.options.draggable) {
            // <debug>
            if (debugLevel >= MID) {
                debug('Initialising toolbar dragging', editor.getElement());
            }
            // </debug>

            wrapper.draggable({
                cancel: 'a, button',
                cursor: 'move',
                // @todo Cancel drag when docked
                // @todo Move draggable into plugin
                // @todo Move tag menu/list into plugin
                handle: '.ui-editor-path',
                stop: $.proxy(function() {
                    // Save the persistant position
                    var pos = editor.persist('position', [
                        wrapper.css('top'),
                        wrapper.css('left')
                    ]);
                    wrapper.css({
                        top: Math.abs(pos[0]),
                        left: Math.abs(pos[1])
                    });

                    // <debug>
                    if (debugLevel >= MID) debug('Saving toolbar position', editor.getElement(), pos);
                    // </debug>
                }, this)
            });

            // Remove the relative position
            wrapper.css('position', '');

            // Set the persistant position
            var pos = editor.persist('position') || this.options.dialogPosition;

            if (!pos) {
                pos = [10, 10];
            }

            // <debug>
            if (debugLevel >= MID) debug('Restoring toolbar position', editor.getElement(), pos);
            // </debug>

            if (parseInt(pos[0], 10) + wrapper.outerHeight() > $(window).height()) {
                pos[0] = $(window).height() - wrapper.outerHeight();
            }
            if (parseInt(pos[1], 10) + wrapper.outerWidth() > $(window).width()) {
                pos[1] = $(window).width() - wrapper.outerWidth();
            }

            wrapper.css({
                top: Math.abs(parseInt(pos[0])),
                left: Math.abs(parseInt(pos[1]))
            });

            // Load the message display widget
            editor.loadMessages();
        }

        $(function() {
            wrapper.appendTo('body');
        });

        // Loop the UI component order option
        for (var i = 0, l = this.options.uiOrder.length; i < l; i++) {
            var uiGroupContainer = $('<div/>')
                .addClass(options.baseClass + '-group');

            // Loop each UI in the group
            var uiGroup = this.options.uiOrder[i];
            for (var ii = 0, ll = uiGroup.length; ii < ll; ii++) {
                // Check if the UI component has been explicitly disabled
                if (!editor.isUiEnabled(uiGroup[ii])) {
                    continue;
                }

                // Check the UI has been registered
                if (Raptor.ui[uiGroup[ii]]) {
                    // Clone the UI object (which should be extended from the defaultUi object)
                    var uiObject = $.extend({}, Raptor.ui[uiGroup[ii]]);

                    // Get the UI components base class
                    var baseClass = uiGroup[ii].replace(/([A-Z])/g, function(match) {
                        return '-' + match.toLowerCase();
                    });

                    var options = $.extend(true, {}, editor.options, {
                        baseClass: editor.options.baseClass + '-ui-' + baseClass
                    }, uiObject.options, editor.options.ui[uiGroup[ii]]);

                    uiObject.editor = editor;
                    uiObject.options = options;
                    var ui = uiObject.init(editor, options);

                    // Append the UI object to the group
                    uiGroupContainer.append(ui);

                    // Add the UI object to the editors list
                    editor.uiObjects[uiGroup[ii]] = uiObject;
                }
                // <strict>
                else {
                    handleError(_('UI identified by key "{{ui}}" does not exist', {ui: uiGroup[ii]}));
                }
                // </strict>
            }

            // Append the UI group to the editor toolbar
            if (uiGroupContainer.children().length > 0) {
                uiGroupContainer.appendTo(this.toolbar);
            }
        }
        $('<div/>').css('clear', 'both').appendTo(this.toolbar);
    },

    show: function() {
        this.wrapper.css('display', '');
    },

    hide: function() {
        this.wrapper.css('display', 'none');
    },

    getElement: function() {
        return this.wrapper;
    },

    destruct: function() {
        if (this.wrapper) {
            this.wrapper.remove();
        }
    }
});
