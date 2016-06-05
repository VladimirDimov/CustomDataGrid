vDataTable = (function () {
    var table = {
        init: function (selector, settings) {
            this._$table = $(selector).first();
            this._$table._currentPage = 1;
            this._settings = settings;

            // Paginator settings
            this._paginator = {};
            this._pageSize = settings.pageSize || 5;
            this._paginator.paginatorLength = settings.paginatorLength || 5;
            this._paginator.$paginator = setPaginator(1, this._paginator.paginatorLength, 1);

            setPageClickEvents();
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

        updatePaginator: function () {

        }
    };

    function ajax(page) {
        $.ajax({
            url: table.settings.ajax.url,
            data: { page: page, pageSize: table.pageSize },
            success: function (data) {
                refreshPageData(data.data);
                updatePaginator(page, Math.ceil(data.rowsNumber / table.paginator.paginatorLength));
            }
        });
    };

    function updatePaginator(page, numberOfPages) {
        var length = table.paginator.paginatorLength;
        var halfLength = Math.floor((table.paginator.paginatorLength - 1) / 2);
        var start = Math.max(Math.floor(page - halfLength), 1);
        start = Math.min(numberOfPages - table.paginator.paginatorLength, start);
        var end = Math.min(start + table.paginator.paginatorLength - 1, numberOfPages);

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

            for (var col = 0; col < element.length; col++) {
                var $col = $('<td>').html(element[col]);
                $row.append($col);
            }

            $tbody.append($row);
        }
    };

    return table;
});