
var tableRenderer = require('../js/renderer.js');

var dataLoader = (function () {
    var dataLoader = {
        loadData: function (table, page, successCallback, errorCallback) {
            var getIdentifiers;

            // Execute onDataLoading events
            for (var index in table.events.onDataLoading) {
                table.events.onDataLoading[index](table);
            }

            var filter = formatFilterRequestValues(table.store.filter);

            getIdentifiers = false;

            $.ajax({
                url: table.settings.ajax.url,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: {
                    identifierPropName: table.store.selectable ? table.store.selectable.identifier : null,
                    getIdentifiers: getIdentifiers,
                    page: page,
                    pageSize: table.settings.paging.pageSize,
                    filter: JSON.stringify(filter),
                    orderBy: table.orderBy ? table.orderBy.Name : null,
                    asc: table.orderBy ? table.orderBy.Asc : true
                },
                success: function (data) {
                    // Add result to the dataTable object
                    refreshPageData(table, data.data, data.identifiers, data.rowsNumber, page);

                    // Invoke events on dataLoaded
                    for (var index in table.events.onDataLoaded) {
                        table.events.onDataLoaded[index](table);
                    }

                    tableRenderer.RenderTableBody(table, data.data);

                    // Invoke events on tableRendered
                    for (var index in table.events.onTableRendered) {
                        table.events.onTableRendered[index](table);
                    }

                    if (successCallback) successCallback(data);
                },
                error: function (err) {
                    table.$table.html(err.responseText);
                    if (errorCallback) errorCallback(err);
                }
            });
        },

        loadIdentifiers: function (table, areSelected, success, error) {
            var getIdentifiers = true;
            var filter = formatFilterRequestValues(table.store.filter);

            $.ajax({
                url: table.settings.ajax.url,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: {
                    identifierPropName: table.store.selectable ? table.store.selectable.identifier : null,
                    getIdentifiers: getIdentifiers,
                    page: 1,
                    pageSize: 1,
                    filter: JSON.stringify(filter),
                    orderBy: null,
                    asc: true
                },
                success: function (data) {
                    initIdentifiers(table, data.identifiers, areSelected);
                    if (success) success(table);
                },
                error: function (err) {
                    table.$table.html(err.responseText);
                    if (errorCallback) errorCallback(err);
                }
            });
        }
    };

    function formatFilterRequestValues(filterObj) {
        var filters = [];
        for (var filter in filterObj) {
            filters.push({
                key: filterObj[filter].value.key,
                value: {
                    operator: filterObj[filter].value.operator,
                    value: filterObj[filter].value.value
                }
            });
        }

        return filters;
    }

    function refreshPageData(table, data, identifiers, rowsNumber, currentPage) {
        var identifierPropName;
        var dataObj = {};

        identifierName = table.store.selectable ? table.store.selectable.identifier : null;

        table.store.currentPage = currentPage;

        for (var i = 0, l = data.length; i < l; i += 1) {
            var curDataRow = data[i];
            dataObj[curDataRow[identifierName] || i] = curDataRow;
        }
        table.store.pageData = dataObj;

        table.store.numberOfRows = rowsNumber;
        if (table.settings.paging.enable) {
            table.store.numberOfPages = Math.ceil(rowsNumber / table.settings.paging.pageSize);
        }

        initIdentifiers(table, identifiers);
    }

    function initIdentifiers(table, identifiers, areSelected) {
        if (!identifiers) {
            return;
        }

        table.store.selectable.identifiers = {};

        for (var i = 0, l = identifiers.length; i < l; i += 1) {
            table.store.selectable.identifiers[identifiers[i]] = {
                selected: areSelected,
            };
        }
    }

    return dataLoader;
} ());

module.exports = dataLoader;