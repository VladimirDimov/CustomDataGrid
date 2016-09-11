var editable = (function () {
    var renderer = require('../js/renderer.js');

    'use strict';
    var editable = {
        init: function (table) {
            var $template = table.$table.find('[dt-template-editable]');
            table.settings.editable.$template = $template;
            debugger;
        },
    };


    function update(table, rowData) {
        table.settings.features.editable.update(rowData);
    }


    function renderRow(table, rowData) {
        var identifierName = table.settings.features.identifier;
        var identifierVal = rowData[identifierName];
        var $row = table.$table.find('tr[data-identifier=' + identifierVal + ']');
        var $newRow = renderer.renderRow(table, rowData);
        $row.html($newRow.html());
    }

    function getColumnIndex(table, colName) {
        return table.store.columnPropertyNames.indexOf(colName);
    }

    return editable;
} ());

module.exports = editable;