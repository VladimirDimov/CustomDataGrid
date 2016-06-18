// var $ = require('jquery');

var selectable = (function () {
    var selectable = {
        makeSelectable: function (table) {
            var $tbody = table.$table.find('tbody');

            $tbody.on('click', function (e) {
                $row = $(e.target).parentsUntil('tbody').first();

                if (!e.ctrlKey && !isSelected(table, $row)) {
                    $tbody.find('tr').css('background-color', 'white');
                    table.store.selectedRows = [];

                    $row.css('background-color', 'gray');
                }

                if (isSelected(table, $row)) {
                    RemoveFromArray($row[0], table.store.selectedRows);
                    $row.css('background-color', 'white');
                } else {
                    table.store.selectedRows.push($row[0]);
                    $row.css('background-color', 'gray');
                }
            });
        },

        getSelected: function (table) {
            var result = [];
            var selectedRows = table.store.selectedRows;
            var delegate = table.settings.features.selectable;

            if (selectedRows == null || selectedRows.length == 0) {
                return null;
            }

            for (var i = 0, l = selectedRows.length; i < l; i += 1) {
                result.push(delegate($(selectedRows[i])));
            }

            console.log(result);
        }
    };

    function isSelected(table, $row) {
        return table.store.selectedRows.includes($row[0])
    }

    function RemoveFromArray(element, arr) {
        var index = arr.indexOf(element);
        arr.splice(index, 1);
    }

    return selectable;
})();

module.exports = selectable;