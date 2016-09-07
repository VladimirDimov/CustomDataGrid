var selectable = require('../js/selectable.js');

var renderer = (function (selectable) {
    'use strict';

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
            var propValue;
            for (var col = 0; col < table.store.columnPropertyNames.length; col++) {
                var propName = table.store.columnPropertyNames[col];

                if (!propName) {
                    throw 'Missing column name. Each <th> in the data table htm element must have an attribute "data-name"'
                }

                propValue = rowData[propName];

                var $col = $('<td>').html(renderer.renderCell(table, propName, propValue));
                $row.append($col);
            }

            $row.attr('data-identifier', identifier);

            return $row;
        },

        RenderTableBody: function (table, data) {
            var $tbody = table.$table.find('tbody').empty();
            var buffer = [];
            for (var row = 0; row < data.length; row++) {
                var rowData = data[row];
                var $row = renderer.renderRow(table, rowData);
                buffer.push($row);
            }

            $tbody.append(buffer);
        }
    };

    return renderer;
} (selectable));

module.exports = renderer;