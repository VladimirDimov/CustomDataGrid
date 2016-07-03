var selectable = require('../js/selectable.js');

var renderer = {

    renderCell: function (table, colName, content) {
        if (table.settings && table.settings.columns && table.settings.columns[colName] && table.settings.columns[colName].render) {
            return table.settings.columns[colName].render(content);
        };

        return content;
    },

    renderRow: function (table, rowData) {
        var identifier = rowData[table.settings.features.identifier];
        var $row = $('<tr>');
        for (var col = 0; col < table._columnPropertyNames.length; col++) {
            var $col = $('<td>').html(renderer.renderCell(table, table._columnPropertyNames[col], rowData[table._columnPropertyNames[col]]));
            $row.append($col);
        }

        $row.attr('data-identifier', identifier);

        return $row;
    }
};

module.exports = renderer;