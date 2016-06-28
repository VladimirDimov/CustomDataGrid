
var dataLoader = (function () {
    var paginator = require('../js/paginator.js');
    var selectable = require('../js/selectable.js');

    var dataLoader = {
        loadData: function (table, page, isUpdatePaginator) {
            paginator(table).updatePaginator = paginator(table).updatePaginator || true;

            $.ajax({
                url: table.settings.ajax.url,
                data: {
                    identifierPropName: table.settings.features.selectable.identifier,
                    getIdentifiers: table.store.identifiers === null,
                    page: page,
                    pageSize: table.settings.pageSize,
                    filter: table.filter,
                    orderBy: table.orderBy ? table.orderBy.Name : null,
                    asc: table.orderBy ? table.orderBy.Asc : true
                },
                success: function (data) {
                    refreshPageData(table, data.data, data.identifiers);

                    if (isUpdatePaginator) {
                        paginator(table).updatePaginator(page, Math.ceil(data.rowsNumber / table.paginator.length));
                    }
                }
            });
        }
    };

    function refreshPageData(table, data, identifiers) {
        table.data = data;
        var $tbody = table.$table.children('tbody').empty();
        // TODO: To foreach the table._columnPropertyNames instead of the response data columns

        for (var row = 0; row < data.length; row++) {
            var element = data[row];
            var $row = $('<tr>');
            var identifier = data[row][table.settings.features.selectable.identifier];

            for (var col = 0; col < table._columnPropertyNames.length; col++) {
                var $col = $('<td>').html(render(table, table._columnPropertyNames[col], element[table._columnPropertyNames[col]]));
                $row.append($col);
            }

            if (table.store.identifiers != null) {
                formatRowSelected(table, $row, identifier);
            }

            $row.attr('data-identifier', identifier);

            if (table.store.identifiers === null) {
                selectable.initIdentifiers(table, identifiers);
            }

            $tbody.append($row);
        }
    }

    function render(table, colName, content) {
        if (table.settings && table.settings.columns && table.settings.columns[colName] && table.settings.columns[colName].render) {
            return table.settings.columns[colName].render(content);
        };

        return content;
    }

    function formatRowSelected(table, $row, identifier) {
        if (isSelected(table, identifier)) {
            $row.css('backgroundColor', table.settings.colors.selectedRow);
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