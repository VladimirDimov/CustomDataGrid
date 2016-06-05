vDataTable = (function () {
    var table = {
        init: function (selector, settings) {
            this._$table = $(selector).first();
            this._$table._currentPage = 1;
            this._settings = settings;

            // Paginator settings
            this._pageSize = settings.pageSize || 5;
            this._paginatorLength = settings.paginatorLength || 5;

            this._$paginator = setPaginator(1, this._paginatorLength);
            this.setPageClickEvents(this._$paginator, settings.ajax.url, this._pageSize, this._$table);
        },

        refreshPageData: function (data, $table) {
            var $tbody = $table.children('tbody').empty();
            for (var row = 0; row < data.length; row++) {
                var element = data[row];
                var $row = $('<tr>');

                for (var col = 0; col < element.length; col++) {
                    var $col = $('<td>').html(element[col]);
                    $row.append($col);
                }

                $tbody.append($row);
            }
        },

        ajax: function (page) {
            $.ajax({
                url: this._settings.ajax.url,
                data: { page: page, pageSize: this._pageSize },
                success: function (data) {
                    table.refreshPageData(data.data, this._$table);
                }
            });
        },

        setPageClickEvents: function () {
            this._$paginator.on('click', 'li>a', function (e) {
                var page = $(e.target).html();
                $(this).children('li').removeClass('active');
                $(e.target).parent().addClass('active');

                table.ajax(page);
            });
        },

        updatePaginator: function () {

        }
    };

    function setPaginator(start, end) {
        var $footer = table._$table.children('tfoot').first();
        var $paginator = $('<ul></ul>')
            .addClass('pagination');

        $footer.append($paginator);

        for (var i = start; i <= end; i++) {
            var $currentPageElement = $('<li><a href="#">' + i + '</a></li>');
            $paginator.append($currentPageElement);
            if (i == start) $currentPageElement.addClass('active');
        }

        return $paginator;
    }

    return table;
});