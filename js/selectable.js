// var $ = require('jquery');

var selectable = (function () {
    return {
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
        }
    };

    function isSelected(table, $row) {
        return table.store.selectedRows.includes($row[0])
    }

    function RemoveFromArray(element, arr) {
        var index = arr.indexOf(element);
        arr.splice(index, 1);
    }

})();

module.exports = selectable;