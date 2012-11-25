Raptor.registerPlugin('tableSupport', new Plugin({
    init: function(ratpor) {
        raptor.on('click', 'td, th', function() {
            // If table cell is empty
            $.trim($(this).text());
            // Select the contents of the cell
        });
    }
}));
