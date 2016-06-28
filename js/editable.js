var editable = (function () {
    'use strict';
    var editable = {
        init: function (table) {
            table.edit = function ($row) {
                var $tds = $row.find('td');

                for (var editObj in table.settings.features.editable) {
                    var colIndex = getColumnIndex(table, editObj);
                    table.settings.features.editable[editObj]($($tds[colIndex]));
                }

                debugger;
            }
        }
    };

    function getColumnIndex(table, colName) {
        return table.columnPropertyNames.indexOf(colName);
    }

    return editable;
} ());

module.exports = editable;