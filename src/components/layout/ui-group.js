function UiGroup(raptor, uiOrder) {
    this.raptor = raptor;
    this.uiOrder = uiOrder;
};

UiGroup.prototype.appendTo = function(layout, panel) {
    // Loop the UI component order option
    for (var i = 0, l = this.uiOrder.length; i < l; i++) {
        var uiGroupContainer = $('<div/>')
            .addClass(this.raptor.options.baseClass + '-layout-toolbar-group');

        // Loop each UI in the group
        var uiGroup = this.uiOrder[i];
        for (var ii = 0, ll = uiGroup.length; ii < ll; ii++) {
            // Check if the UI component has been explicitly disabled
            if (!this.raptor.isUiEnabled(uiGroup[ii])) {
                continue;
            }

            // Check the UI has been registered
            if (Raptor.ui[uiGroup[ii]]) {
                var uiOptions = this.raptor.options.plugins[uiGroup[ii]];
                if (uiOptions === false) {
                    continue;
                }

                var component = this.raptor.prepareComponent(Raptor.ui[uiGroup[ii]], uiOptions, 'ui');
                component.instance.layout = layout;

                this.raptor.uiObjects[uiGroup[ii]] = component.instance;

                if (typeIsElement(component.init)) {
                    // Fix corner classes
                    component.init.removeClass('ui-corner-all');

                    // Append the UI object to the group
                    uiGroupContainer.append(component.init);
                }
            }
            // <strict>
            else {
                handleError('UI identified by key "' + uiGroup[ii] + '" does not exist');
            }
            // </strict>
        }

        // Append the UI group to the editor toolbar
        if (uiGroupContainer.children().length > 0) {
            uiGroupContainer.appendTo(panel);
        }
    }

    // Fix corner classes
    panel.find('.ui-button:first-child').addClass('ui-corner-left');
    panel.find('.ui-button:last-child').addClass('ui-corner-right');
};
