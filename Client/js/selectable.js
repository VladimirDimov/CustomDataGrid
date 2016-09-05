var selectable = (function () {
    var selectable = {
        makeSelectable: function (table) {
            if (table.settings.features.selectable.enable === false) {
                return;
            }

            table.events.onTableRendered.push(selectable.refreshPageSelection);
            table.store.requestIdentifiersOnDataLoad = true;
            var $tbody = table.$table.find('tbody');

            $tbody.on('click', function (e) {
                var $row = $(e.target).parentsUntil('tbody').last();
                var identifier = $row.attr('data-identifier');
                var rowIsSelected = isSelected(table, identifier);
                var numberOfSelectedRows;

                // No Ctrl && Row is not selected
                if (!e.ctrlKey) {
                    numberOfSelectedRows = selectable.unselectAll(table);
                }

                if (rowIsSelected) {
                    if (numberOfSelectedRows > 1) {
                        setIdentifierSelectStatus(table, identifier, true);
                    } else {
                        setIdentifierSelectStatus(table, identifier, false);
                    }
                } else {
                    setIdentifierSelectStatus(table, identifier, true);
                }

                selectable.refreshPageSelection(table);
            });

            table.selectAll = function () {
                selectable.selectAll(table);
                selectable.refreshPageSelection(table);
            };

            table.unselectAll = function () {
                selectable.unselectAll(table);
            };
        },

        getSelected: function (table) {
            if (table.settings.features.selectable.enable === false) {
                throw "The selectable option is disabled. You can enable it by setting the property settings.features.selectable.enable = true";
            }

            var selectedIdentifiers = table.store.identifiers.filter(function (elem) {
                return elem.selected === true;
            }).map(function (elem) {
                return elem.identifier;
            });

            console.log(selectedIdentifiers);
        },

        unselectAll: function (table) {
            var numberOfModifiedRows = 0;
            if (table.store.identifiers) {
                table.store.identifiers.map(function (elem) {
                    if (elem.selected == true) {
                        numberOfModifiedRows += 1;
                    }

                    elem.selected = false;

                    return elem;
                });

                this.refreshPageSelection(table);

                return numberOfModifiedRows;
            }
        },

        selectAll: function (table) {
            if (table.store.identifiers) {
                table.store.identifiers.map(function (elem) {
                    elem.selected = true;

                    return elem;
                });
            }
        },

        refreshPageSelection: function (table) {
            var tableRows = table.$table.find('tbody tr').slice();
            for (var i = 0, l = tableRows.length; i < l; i += 1) {
                var $row = $(tableRows[i]);
                var rowIdentifier = $row.attr('data-identifier');
                if (isSelected(table, rowIdentifier)) {
                    setRowSelectCssClasses(table, $row, true);
                } else {
                    setRowSelectCssClasses(table, $row, false);
                }
            }
        }
    };

    function setRowSelectCssClasses(table, $row, isSelected) {
        var cssClasses = table.settings.features.selectable.cssClasses;
        if (isSelected) {
            $row.addClass(cssClasses);
        } else {
            $row.removeClass(cssClasses);
        }
    }

    function isSelected(table, identifier) {
        var identifierObj = table.store.identifiers.find(function (el) {
            return el.identifier == identifier;
        });

        return identifierObj.selected;
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