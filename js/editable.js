var editable = (function () {
    'use strict';
    var editable = {
        init: function (table) {
            table.edit = function ($row) {

            }
        }
    };

    function getColumnIndex(table, colName) {
        return table.columnPropertyNames.indexOf(colName);
    }

    return editable;
} ());

module.exports = editable;