var selectable = require('../js/selectable.js');

var renderer = (function (selectable) {
    'use strict';

    var renderer = {

        init: function (table) {
            table.store.templates.$main = table.$table.find('table[dt-table] tr[dt-template-main]');
        },

        renderCell: function (table, colName, content, rowData) {
            if (table.settings && table.settings.columns && table.settings.columns[colName] && table.settings.columns[colName].render) {
                return table.settings.columns[colName].render(content, rowData);
            };

            return content;
        },

        renderRow: function (table, rowData) {
            var identifier = rowData[table.settings.features.identifier];
            var $row = $('<tr>');
            var propValue, $template;

            if (table.store.templates.$main != undefined) {
                // Handle when there is main template
            }

            // If there is no main template provided the renderer will render the cells directly into the td elements
            for (var col = 0, l = table.store.columnPropertyNames.length; col < l; col++) {
                var propName = table.store.columnPropertyNames[col];

                if (!propName) {
                    throw 'Missing column name. Each <th> in the data table htm element must have an attribute "data-name"'
                }

                propValue = rowData[propName];

                var $col = $('<td>').html(renderer.renderCell(table, propName, propValue, rowData));
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