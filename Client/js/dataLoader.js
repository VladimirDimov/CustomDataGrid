
var paginator = require('../js/paginator.js');
var selectable = require('../js/selectable.js');
var tableRenderer = require('../js/table-renderer.js');
var q = require('../node_modules/q/q.js')

var dataLoader = (function () {
    var dataLoader = {
        loadData: function (table, page, isUpdatePaginator) {
            var deferred = q.defer();

            // Execute onDataLoading events
            for (var index in table.events.onDataLoading) {
                table.events.onDataLoading[index](table);
            }

            $.ajax({
                url: table.settings.ajax.url,
                data: {
                    identifierPropName: table.settings.features.identifier,
                    getIdentifiers: table.store.requestIdentifiersOnDataLoad && table.store.identifiers === null,
                    page: page,
                    pageSize: table.settings.paging.pageSize,
                    filter: JSON.stringify(formatFilterRequestValues(table.store.filter)),
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

                    deferred.resolve();
                },
                error: function (err) {
                    table.$table.html(err.responseText);
                }
            });

            return deferred.promise;
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
        table.store.currentPage = currentPage;
        table.store.pageData = data;
        table.store.numberOfRows = rowsNumber;
        if (table.settings.paging.enable) {
            table.store.numberOfPages = Math.ceil(rowsNumber / table._paginator.length);
        }

        initIdentifiers(table, identifiers);
    }

    function initIdentifiers(table, identifiers) {
        if (table.store.identifiers || !identifiers) {
            return;
        }

        table.store.identifiers = {};

        for (var i = 0, l = identifiers.length; i < l; i += 1) {
            table.store.identifiers[identifiers[i]] = {
                selected: false,
            };
        }
    }

    return dataLoader;
} ());

module.exports = dataLoader;