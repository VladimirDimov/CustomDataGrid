var validator = require('../../../js/validator.js');
var defaultSettings = require('../../../js/defaultSettings.js');
var dataLoader = require('../../../js/dataLoader.js');

var selectableInitialiser = (function () {
    var selectable = {
        init: function (table, settings) {
            if (!isSelectable(settings)) {
                return;
            }

            table.events.onTableRendered.push(selectable.refreshPageSelection);

            if (settings.selectable.onSelectedRowRendered) {
                table.events.onSelectedRowRendered.push(settings.selectable.onSelectedRowRendered);
            }

            if (settings.selectable.onNotSelectedRowRendered) {
                table.events.onNotSelectedRowRendered.push(settings.selectable.onNotSelectedRowRendered);
            }

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

            return seletedIdentifiers;
        },

        unselectAll: function (table, callback) {
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
                if (callback) callback();

                return numberOfModifiedRows;
            }
        },

        selectAll: function (table, callback) {
            dataLoader.loadIdentifiers(table, true, function (table) {
                selectable.refreshPageSelection(table);
                if (callback) callback();
            });
        },

        refreshPageSelection: function (table) {
            var tableRows = table.$table.find('tbody tr').slice();
            for (var i = 0, l = tableRows.length; i < l; i += 1) {
                var $row = $(tableRows[i]);
                var rowIdentifier = $row.attr('data-identifier');
                if (isSelected(table, rowIdentifier)) {
                    setRowSelectCssClasses(table, $row, true);

                    // Run events for selected
                    table.events.onSelectedRowRendered.forEach(function (event) {
                        event($row);
                    }, this);

                } else {
                    setRowSelectCssClasses(table, $row, false);

                    // Run events for not selected
                    table.events.onNotSelectedRowRendered.forEach(function (event) {
                        event($row);
                    }, this);

                }
            }
        }
    };

    function configure(table, settings) {
        table.store.selectable = {};
        table.store.selectable.identifiers = {};
        table.store.selectable.identifier = settings.selectable.identifier;
        table.store.selectable.requestIdentifiersOnDataLoad = true;
        table.store.selectable.multi = settings.selectable.multi;
        table.store.selectable.cssClasses = settings.selectable.cssClasses || 'active';
    }

    function setFunctions(table) {
        table.selectAll = function (callback) {
            selectable.selectAll(table, callback);
            selectable.refreshPageSelection(table);
        };

        table.unselectAll = function (callback) {
            selectable.unselectAll(table, callback);
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
        if (table.store.selectable.identifiers[identifier] === undefined) {
            table.store.selectable.identifiers[identifier] = {};
        }

        var identifierObj = table.store.selectable.identifiers[identifier];

        return identifierObj;
    }

    function setIdentifierSelectStatus(table, identifier, selected) {
        var identifierObj = GetIdentifierObj(table, identifier);
        identifierObj.selected = selected;
    }

    return selectable;
})();

module.exports = selectableInitialiser;