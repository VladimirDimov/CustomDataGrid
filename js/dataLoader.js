
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
                    getIdentifiers: table.store.identifiers === null,
                    page: page,
                    pageSize: table.settings.pageSize,
                    filter: JSON.stringify(formatFilterRequestValues(table.store.filter)),
                    orderBy: table.orderBy ? table.orderBy.Name : null,
                    asc: table.orderBy ? table.orderBy.Asc : true
                },
                success: function (data) {
                    refreshPageData(table, data.data, data.identifiers, data.rowsNumber, page);

                    for (var index in table.events.onDataLoaded) {
                        table.events.onDataLoaded[index](table);
                    }

                    deferred.resolve();
                },
                error: function (err) {
                    console.log(err);
                    throw err;
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
        table.store.numberOfPages = Math.ceil(rowsNumber / table._paginator.length);

        var $tbody = table.$table.children('tbody').empty();

        for (var row = 0; row < data.length; row++) {
            var rowData = data[row];
            var identifier = rowData[table.settings.features.identifier];
            var $row = tableRenderer.renderRow(table, rowData);
            $tbody.append($row);

            if (table.store.identifiers === null) {
                selectable.initIdentifiers(table, identifiers);
            }
        }
    }

    return dataLoader;
} ());

module.exports = dataLoader;