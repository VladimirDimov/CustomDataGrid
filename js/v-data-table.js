vDataTable = (function () {
    var defaultSettings = {
        pageSize: 5,
        paginator: {
            length: 5
        },
        filter: {
            enabled: true
        }
    };

    var table = {
        init: function (selector, settings) {
            this._$table = $(selector).first();
            this._$table._currentPage = 1;
            this._settings = settings;

            // Paginator settings
            this._paginator = {};
            this._pageSize = settings.pageSize || defaultSettings.pageSize;
            this._paginator.length = (settings.paginator && settings.paginator.length) || defaultSettings.paginator.length;
            this._paginator.$paginator = setPaginator(1, this._paginator.length, 1);
            this._columnPropertyNames = setColumnPropertyNames();

            setPageClickEvents();
            setFilterEvent();
            formatSortables();
            ajax(1);
        },

        get settings() {
            return this._settings;
        },

        get paginator() {
            return this._paginator;
        },

        get $table() {
            return this._$table;
        },

        get pageSize() {
            return this._pageSize;
        },

        get filter() {
            var $filter = $(table.$table[0]).find('.filter');
            return $filter.val();
        }
    };

    function formatSortables() {
        var $sortables = table.$table.find('thead tr:last-child th[sortable]');

        $sortables.on('click', function (e) {
            var name = $(e.target).attr('data-colName');
            var isAsc = (table.orderBy && table.orderBy.Name == name) ? !table.orderBy.Asc : true;
            table.orderBy = {
                Name: name,
                Asc: isAsc
            };

            $sortables.removeAttr('asc desc');
            if (isAsc) {
              $(e.target).attr('asc', '')
            } else {
              $(e.target).attr('desc', '')
            }

            ajax(1);
        });
    };

    function setColumnPropertyNames() {
        var colPropNames = [];
        var $columns = table.$table.find('thead tr:last-child').children();
        for (var i = 0; i < $columns.length; i++) {
            colPropNames.push($($columns[i]).attr('data-colName'));
        }

        return colPropNames;
    };

    function ajax(page) {
        $.ajax({
            url: table.settings.ajax.url,
            data: {
                page: page,
                pageSize: table.pageSize,
                filter: table.filter,
                orderBy: table.orderBy ? table.orderBy.Name : null,
                asc: table.orderBy ? table.orderBy.Asc : true
            },
            success: function (data) {
                refreshPageData(data.data);
                updatePaginator(page, Math.ceil(data.rowsNumber / table.paginator.length));
            }
        });
    };

    function updatePaginator(page, numberOfPages) {
        var length = table.paginator.length;
        var halfLength = Math.floor((table.paginator.length - 1) / 2);
        table.paginator.length = Math.min(table.paginator.length, numberOfPages);

        var start = Math.max(Math.floor(page - halfLength), 1);
        start = Math.min(numberOfPages - table.paginator.length, start);
        var end = Math.min(start + table.paginator.length - 1, numberOfPages);

        table.paginator.$paginator = setPaginator(start, end, page);
        setPageClickEvents();
    };

    function setPageClickEvents() {
        table.paginator.$paginator.on('click', 'li>a', function (e) {
            var page = $(e.target).html();
            table.paginator.$paginator.children('li').removeClass('active');
            $(e.target).parent().addClass('active');

            ajax(page);
        });
    };

    function setFilterEvent() {
        var $filter = $(table.$table[0]).find('.filter');
        $filter.on('change', function () {
            ajax(1);
        });
    }

    function setPaginator(start, end, activePage) {
        var $footer = table._$table.children('tfoot').first();
        $footer.children('.pagination').remove();
        var $paginator = $('<ul></ul>')
            .addClass('pagination');

        $footer.append($paginator);

        for (var i = start; i <= end; i++) {
            var $currentPageElement = $('<li><a href="#">' + i + '</a></li>');
            $paginator.append($currentPageElement);
            if (i == activePage) $currentPageElement.addClass('active');
        }

        return $paginator;
    };

    function refreshPageData(data) {
        var $tbody = table.$table.children('tbody').empty();
        for (var row = 0; row < data.length; row++) {
            var element = data[row];
            var $row = $('<tr>');

            for (var col = 0; col < table._columnPropertyNames.length; col++) {
                var $col = $('<td>').html(element[table._columnPropertyNames[col]]);
                $row.append($col);
            }

            $tbody.append($row);
        }
    };

    return table;
});
