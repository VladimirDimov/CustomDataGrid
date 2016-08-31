
var dataLoader = (function () {
    var paginator = require('../js/paginator.js');
    var selectable = require('../js/selectable.js');
    var tableRenderer = require('../js/table-renderer.js');
    var q = require('../node_modules/q/q.js')

    var dataLoader = {
        loadData: function (table, page, isUpdatePaginator) {
            var deferred = q.defer();
            $.ajax({
                url: table.settings.ajax.url,
                data: {
                    identifierPropName: table.settings.features.identifier,
                    getIdentifiers: table.store.identifiers === null,
                    page: page,
                    pageSize: table.settings.pageSize,
                    filter: JSON.stringify(table.store.filter),
                    orderBy: table.orderBy ? table.orderBy.Name : null,
                    asc: table.orderBy ? table.orderBy.Asc : true
                },
                success: function (data) {
                    refreshPageData(table, data.data, data.identifiers, data.rowsNumber);

                    if (isUpdatePaginator) {
                        paginator(table).updatePaginator(page, Math.ceil(data.rowsNumber / table.paginator.length));
                    }

                    deferred.resolve();
                },
                error: function (err) {
                    console.log(err.responseText);
                    throw err;
                }
            });

            return deferred.promise;
        }
    };

    function refreshPageData(table, data, identifiers, rowsNumber) {
        table.store.pageData = data;
        table.store.numberOfRows = rowsNumber;
        table.store.numberOfPages = Math.ceil(rowsNumber / table._paginator.length);

        tableRenderer.renderNumberOfRows(table);
        tableRenderer.renderNumberOfPages(table);

        var $tbody = table.$table.children('tbody').empty();
        // TODO: To foreach the table._columnPropertyNames instead of the response data columns

        for (var row = 0; row < data.length; row++) {
            var rowData = data[row];
            var identifier = rowData[table.settings.features.identifier];
            var $row = tableRenderer.renderRow(table, rowData);
            $tbody.append($row);

            if (table.store.identifiers === null) {
                selectable.initIdentifiers(table, identifiers);
            }
        }

        selectable.refreshPageSelection(table);
    }

    function formatRowSelected(table, $row, identifier) {
        if (isSelected(table, identifier)) {
            debugger;
            selectable.setRowSelectCssClasses();
        }
    }

    function isSelected(table, identifier) {
        var identifiers = table.store.identifiers;
        var status = identifiers.filter(function (element) {
            return element.identifier == identifier;
        })[0].selected;

        return status;
    }

    return dataLoader;
} ());

module.exports = dataLoader;