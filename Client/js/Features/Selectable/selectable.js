var validator = require('../../../js/validator.js');
var defaultSettings = require('../../../js/defaultSettings.js');

var selectableInitialiser = (function () {
    var selectable = {
        init: function (table, settings) {
            if (!isSelectable(settings)) {
                return;
            }

            table.events.onTableRendered.push(selectable.refreshPageSelection);

            configure(table, settings);

            setEvents(table);
            setFunctions(table);
        },

        getSelected: function (table) {
            var seletedIdentifiers = [];
            var identifiers = table.store.selectable.identifiers;
            if (table.store.selectable.enable === false) {
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
            var identifiers = table.store.selectable.identifiers;
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
            if (table.store.selectable.identifiers) {
                for (var prop in table.store.selectable.identifiers) {
                    table.store.selectable.identifiers[prop].selected = true;
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

    function configure(table, settings) {
        table.store.selectable = {};
        table.store.selectable.identifier = settings.selectable.identifier;
        table.store.selectable.identifiers = null;
        table.store.selectable.requestIdentifiersOnDataLoad = true;
        table.store.selectable.multi = settings.selectable.multi;
        table.store.selectable.cssClasses = settings.selectable.cssClasses || 'active';
    }

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
            if (!e.ctrlKey || !table.store.selectable.multi) {
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
        if (settings.selectable && settings.selectable.enable !== undefined) {
            validator.ValidateMustBeValidBoolean(settings.selectable.enable, 'settings.features.selectable.enable');
            return settings.selectable.enable;
        }

        return defaultSettings.features.selectable.enable;
    }

    function setRowSelectCssClasses(table, $row, isSelected) {
        var cssClasses = table.store.selectable.cssClasses;
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
        if (!table.store.selectable.identifiers) {
            throw "There are no identifiers loaded to the data table";
        }

        var identifierObj = table.store.selectable.identifiers[identifier];

        if (!identifierObj) {
            throw "Invalid identifier value: " + identifier;
        }

        return identifierObj;
    }

    function setIdentifierSelectStatus(table, identifier, selected) {
        var identifierObj = GetIdentifierObj(table, identifier);
        identifierObj.selected = selected;
    }

    return selectable;
})();

module.exports = selectableInitialiser;