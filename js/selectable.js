var $ = require('jquery');

var selectable = (function () {
    return {
        makeSelectable: function (table) {
            var $tbody = table.$table.find('tbody');
            $tbody.on('click', function (e) {
                $row = $(e.target).parentsUntil('tbody').first();

                if (!e.ctrlKey) {
                    $tbody.find('tr').css('background-color', 'white');
                    table.data.selectedRows = [];

                    $row.css('background-color', 'gray');
                }

                if (table.data.selectedRows.includes($row[0])) {
                    RemoveFromArray($row[0], table.data.selectedRows);
                    $row.css('background-color', 'white');
                } else {
                    table.data.selectedRows.push($row[0]);
                    $row.css('background-color', 'gray');
                }
            });
        }
    };

    function RemoveFromArray(element, arr) {
        var index = arr.indexOf(element);
        arr.splice(index, 1);
    }

})();

module.exports = selectable;