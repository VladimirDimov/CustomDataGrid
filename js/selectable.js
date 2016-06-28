var selectable = (function () {
    var selectable = {
        makeSelectable: function (table) {
            var $tbody = table.$table.find('tbody');

            $tbody.on('click', function (e) {
                $row = $(e.target).parentsUntil('tbody').last();
                var identifier = $row.attr('data-identifier');

                if (!e.ctrlKey && !isSelected(table, $row)) {
                    $tbody.find('tr').css('background-color', 'white');
                    selectable.unselectAll(table);
                    // $row.css('background-color', 'gray');
                }

                if (isSelected(table, $row)) {
                    RemoveFromArray($row[0], table.store.selectedRows);
                    setIdentifierSelectStatus(table, identifier, false);
                    $row.css('background-color', 'white');
                } else {
                    setIdentifierSelectStatus(table, identifier, true);
                    $row.css('background-color', 'gray');
                }
            });

            table.selectAll = function () {
                selectable.selectAll(table);
                refreshPageSelection(table);
            };

            table.unselectAll = function () {
                selectable.unselectAll(table);
            };
        },

        getSelected: function (table) {
            var selectedIdentifiers = table.store.identifiers.filter(function (elem) {
                return elem.selected === true;
            }).map(function (elem) {
                return elem.identifier;
            });

            console.log(selectedIdentifiers);
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

                refreshPageSelection(table);
            }
        },

        selectAll: function (table) {
            if (table.store.identifiers) {
                table.store.identifiers.map(function (elem) {
                    elem.selected = true;

                    return elem;
                });
            }
        }
    };

    function refreshPageSelection(table) {
        var tableRows = table.$table.find('tbody tr').slice();
        for (var i = 0, l = tableRows.length; i < l; i += 1) {
            var $row = $(tableRows[i]);
            var rowIdentifier = $row.attr('data-identifier');
            if (table.store.identifiers[rowIdentifier].selected) {
                $row.css('background-color', 'gray');
            } else {
                $row.css('background-color', '');
            }
        }
    }

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