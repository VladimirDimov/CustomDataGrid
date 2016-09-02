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

        renderNumberOfRows: function (table) {
            var numberOfRows = table.store.numberOfRows;

            var containers = table.$table.find('[number-of-rows]');

            for (var i = 0, l = containers.length; i < l; i += 1) {
                $(containers[i]).html(numberOfRows);
            }
        },

        renderNumberOfPages: function (table) {
            var numberOfPages = table.store.numberOfPages;

            var containers = table.$table.find('[number-of-pages]');

            for (var i = 0, l = containers.length; i < l; i += 1) {
                $(containers[i]).html(numberOfPages);
            }
        }
    };

    return renderer;
} (selectable));

module.exports = renderer;