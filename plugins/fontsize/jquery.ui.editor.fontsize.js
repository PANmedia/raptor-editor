(function($) {
    $.ui.editor.addButton('increaseFontSize', {
        title: 'Increase Font Size',
        icons: {
            primary: 'ui-icon-font-increase'
        },
        classes: 'ui-editor-icon',
        click: function() {
            
            this._actions.beforeStateChange.call(this);
            this._selection.enforceLegality.call(this);

            var editorInstance = this,
                    content = null, increasedSize = null, replacement = null, style = null;

            if (!this._selection.exists.call(this)) {
                style = { 'font-size': '110%' };
                if (!this._util.isRoot.call(this, this._editor.selectedElement)) this._editor.selectedElement.css(style);
                else this.element.children().css(style);
            } else {

                $(rangy.getSelection().getAllRanges()).each(function(){
                    content = this.createContextualFragment();
                    if ((this.commonAncestorContainer == this.startContainer && this.commonAncestorContainer == this.endContainer)
                        && (this.startOffset == 0 && this.endOffset == 1)) {

                        increasedSize = ($(this.commonAncestorContainer).css('font-size').replace('px', '') * 1.1);
                        $(this.commonAncestorContainer).css('font-size', increasedSize);
                    } else {

                        replacement = $('<span style="font-size:110%"></span>');

                        this.splitBoundaries();
                        $.each(this.getNodes(), function() {
                            replacement.append(this);
                        });

                        editorInstance._selection.replace.call(editorInstance, replacement, this);
                    }
                });
            }

            this._actions.stateChange.call(this);
        }
    });
    
    $.ui.editor.addButton('decreaseFontSize', {
        title: 'Decrease Font Size',
        icons: {
            primary: 'ui-icon-font-decrease'
        },
        classes: 'ui-editor-icon',
        click: function() {
            this._actions.beforeStateChange.call(this);
            this._selection.enforceLegality.call(this);

            var editorInstance = this,
                style = null, increasedSize = null, replacement = null;

            if (!this._selection.exists.call(this)) {
                style = { 'font-size': '90%' };
                if (!this._util.isRoot.call(this, this._editor.selectedElement)) this._editor.selectedElement.css(style);
                else this.element.children().css(style);
            } else {
                $(rangy.getSelection().getAllRanges()).each(function(){
                    var content = this.createContextualFragment();
                    if ((this.commonAncestorContainer == this.startContainer && this.commonAncestorContainer == this.endContainer)
                        && (this.startOffset == 0 && this.endOffset == 1)) {

                        increasedSize = ($(this.commonAncestorContainer).css('font-size').replace('px', '') * 0.9);
                        $(this.commonAncestorContainer).css('font-size', increasedSize);
                    } else {

                        replacement = $('<span style="font-size:90%"></span>');

                        this.splitBoundaries();
                        $.each(this.getNodes(), function() {
                            replacement.append(this);
                        });

                        editorInstance._selection.replace.call(editorInstance, replacement, this);
                    }
                });
            }

            this._actions.stateChange.call(this);
        }
    });
})(jQuery);
