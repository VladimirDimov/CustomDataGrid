
var dataLoader = (function () {
    var paginator = require('../js/paginator.js');

    var dataLoader = {
        loadData: function (table, page, isUpdatePaginator) {
            paginator(table).updatePaginator = paginator(table).updatePaginator || true;

            $.ajax({
                url: table.settings.ajax.url,
                data: {
                    page: page,
                    pageSize: table.settings.pageSize,
                    filter: table.filter,
                    orderBy: table.orderBy ? table.orderBy.Name : null,
                    asc: table.orderBy ? table.orderBy.Asc : true
                },
                success: function (data) {
                    refreshPageData(table, data.data);
                    if (isUpdatePaginator) {
                        paginator(table).updatePaginator(page, Math.ceil(data.rowsNumber / table.paginator.length));
                    }
                }
            });
        }
    };

    function refreshPageData(table, data) {
        table.data = data;
        var $tbody = table.$table.children('tbody').empty();
        // TODO: To foreach the table._columnPropertyNames instead of the response data columns
        for (var row = 0; row < data.length; row++) {
            var element = data[row];
            var $row = $('<tr>');

            for (var col = 0; col < table._columnPropertyNames.length; col++) {
                var $col = $('<td>').html(render(table, table._columnPropertyNames[col], element[table._columnPropertyNames[col]]));
                $row.append($col);
            }

            formatRow(table, $row);

            $tbody.append($row);
        }
    }

    function render(table, colName, content) {
        if (table.settings && table.settings.columns && table.settings.columns[colName] && table.settings.columns[colName].render) {
            return table.settings.columns[colName].render(content);
        };

        return content;
    }

    function formatRow(table, $row) {
        if (isSelected(table, $row)) {
            $row.css('backgroundColor', table.settings.colors.selectedRow);
        }
    }

    function isSelected(table, $row) {
        return table.store.selectedRows.includes($row[0])
    }

    return dataLoader;
} ());

module.exports = dataLoader;