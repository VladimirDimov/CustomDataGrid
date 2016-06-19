var selectable = (function () {
    var selectable = {
        makeSelectable: function (table) {
            var $tbody = table.$table.find('tbody');

            $tbody.on('click', function (e) {
                $row = $(e.target).parentsUntil('tbody').first();
                var identifier = $row.attr('data-identifier');

                if (!e.ctrlKey && !isSelected(table, $row)) {
                    $tbody.find('tr').css('background-color', 'white');
                    table.store.selectedRows = [];
                    selectable.unselectAll(table);
                    // $row.css('background-color', 'gray');
                }

                if (isSelected(table, $row)) {
                    RemoveFromArray($row[0], table.store.selectedRows);
                    setIdentifierSelectStatus(table, identifier, false);
                    $row.css('background-color', 'white');
                } else {
                    table.store.selectedRows.push($row[0]);
                    setIdentifierSelectStatus(table, identifier, true);
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
        },

        initIdentifiers(table, identifiers) {
            table.store.identifiers = [];

            for (var i = 0, l = identifiers.length; i < l; i += 1) {
                table.store.identifiers.push({
                    selected: false,
                    identifier: identifiers[i]
                });
            }
        },

        unselectAll: function (table) {
            if (table.store.identifiers) {
                table.store.identifiers.map(function (elem) {
                    elem.selected = false;

                    return elem;
                });
            }
        }
    };

    function isSelected(table, $row) {
        return table.store.selectedRows.includes($row[0])
    }

    function RemoveFromArray(element, arr) {
        var index = arr.indexOf(element);
        arr.splice(index, 1);
    }

    function setIdentifierSelectStatus(table, identifier, selected) {
        var identifiers = table.store.identifiers;

        var element = identifiers.filter(function (element) {
            return element.identifier == identifier;
        })[0];

        element.selected = selected;
    }

    return selectable;
})();

module.exports = selectable;