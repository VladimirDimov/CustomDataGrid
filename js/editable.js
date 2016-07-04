var editable = (function () {
    var tableRenderer = require('../js/table-renderer.js');

    'use strict';
    var editable = {
        init: function (table) {
            table.edit = function ($row) {
                var $tds = $row.find('td');
                for (var editObj in table.settings.features.editable.columns) {
                    var colIndex = getColumnIndex(table, editObj);
                    table.settings.features.editable.columns[editObj].edit($($tds[colIndex]));
                }
            };

            table.save = function ($row) {
                var $tds = $row.find('td');
                var pageData = table.store.pageData;
                var identifierName = table.settings.features.identifier;
                var identifierVal = $row.attr('data-identifier');
                var rowData = pageData.filter(function (item) {
                    return item[identifierName] == identifierVal;
                })[0];

                for (var editObj in table.settings.features.editable.columns) {
                    var colIndex = getColumnIndex(table, editObj);
                    var content = table.settings.features.editable.columns[editObj].save($($tds[colIndex]));
                    rowData[editObj] = content;
                }

                update(table, rowData);
                renderRow(table, rowData);
            };
        },
    };


    function update(table, rowData) {
        table.settings.features.editable.update(rowData);
    }


    function renderRow(table, rowData) {
        var identifierName = table.settings.features.identifier;
        var identifierVal = rowData[identifierName];
        var $row = table.$table.find('tr[data-identifier=' + identifierVal + ']');
        var $newRow = tableRenderer.renderRow(table, rowData);
        $row.html($newRow.html());
    }

    function getColumnIndex(table, colName) {
        return table.columnPropertyNames.indexOf(colName);
    }

    return editable;
} ());

module.exports = editable;