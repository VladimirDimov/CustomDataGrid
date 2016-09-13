var validator = require('../js/validator.js');
var defaultSettings = require('../js/dt-default-settings.js');

var selectable = (function () {
    var selectable = {
        init: function (table, settings) {
            if (!isSelectable(settings)) {
                return;
            }

            table.store.identifiers = null;
            table.events.onTableRendered.push(selectable.refreshPageSelection);
            table.store.requestIdentifiersOnDataLoad = true;

            setEvents(table);
            setFunctions(table);
        },

        getSelected: function (table) {
            var seletedIdentifiers = [];
            var identifiers = table.store.identifiers;
            if (table.settings.features.selectable.enable === false) {
                throw "The selectable option is disabled. You can enable it by setting the property settings.features.selectable.enable = true";
            }

            for (var identifier in identifiers) {
                var curIdentifier = identifiers[identifier];
                if (curIdentifier.selected === true) {
                    seletedIdentifiers.push(identifier);
                }
            }

            console.log(seletedIdentifiers);
        },

        unselectAll: function (table) {
            var numberOfModifiedRows = 0;
            var identifiers = table.store.identifiers;
            if (identifiers) {
                for (var prop in identifiers) {
                    if (identifiers[prop].selected == true) {
                        numberOfModifiedRows += 1;
                    }

                    identifiers[prop].selected = false;
                };

                this.refreshPageSelection(table);

                return numberOfModifiedRows;
            }
        },

        selectAll: function (table) {
            if (table.store.identifiers) {
                for (var prop in table.store.identifiers) {
                    table.store.identifiers[prop].selected = true;
                }
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

    function setFunctions(table) {
        table.selectAll = function () {
            selectable.selectAll(table);
            selectable.refreshPageSelection(table);
        };

        table.unselectAll = function () {
            selectable.unselectAll(table);
        };
    }

    function setEvents(table) {
        var $tbody = table.$table.find('tbody');

        $tbody.on('click', function (e) {
            var $row = $(e.target).parentsUntil('tbody').last();
            var identifier = $row.attr('data-identifier');
            var rowIsSelected = isSelected(table, identifier);
            var numberOfSelectedRows;

            // No Ctrl && is not multiselect
            if (!e.ctrlKey || !table.settings.features.selectable.multi) {
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
    }

    function isSelectable(settings) {
        if (settings.features && settings.features.selectable && settings.features.selectable.enable !== undefined) {
            validator.ValidateMustBeValidBoolean(settings.features.selectable.enable, 'settings.features.selectable.enable');
            return settings.features.selectable.enable;
        }

        return defaultSettings.features.selectable.enable;
    }

    function setRowSelectCssClasses(table, $row, isSelected) {
        var cssClasses = table.settings.features.selectable.cssClasses;
        if (isSelected) {
            $row.addClass(cssClasses);
        } else {
            $row.removeClass(cssClasses);
        }
    }

    function isSelected(table, identifier) {
        var identifierObj = GetIdentifierObj(table, identifier);

        return identifierObj.selected;
    }

    function GetIdentifierObj(table, identifier) {
        if (!table.store.identifiers) {
            throw "There are no identifiers loaded to the data table";
        }

        var identifierObj = table.store.identifiers[identifier];

        if (!identifierObj) {
            throw new "Invalid identifier value: " + identifier;
        }

        return identifierObj;
    }

    function RemoveFromArray(element, arr) {
        var index = arr.indexOf(element);
        arr.splice(index, 1);
    }

    function setIdentifierSelectStatus(table, identifier, selected) {
        var identifiers = table.store.identifiers;
        var identifierObj = GetIdentifierObj(table, identifier);
        identifierObj.selected = selected;
    }

    return selectable;
})();

module.exports = selectable;