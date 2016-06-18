var paginator = function (table) {
    var paginator = {
        setPaginator: function (start, end, activePage) {
            table.paginator.start = start;
            table.paginator.end = end;

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
        },

        updatePaginator: function (page, numberOfPages) {
            var start, end;
            var length = table.paginator.length;
            var halfLength = Math.floor((length - 1) / 2);
            var currentPaginatorLength = Math.min(length, numberOfPages);

            if (currentPaginatorLength > 0) {
                start = Math.max(Math.floor(page - halfLength), 1);
                end = Math.min(start + currentPaginatorLength - 1, numberOfPages);
                if (end - start + 1 < currentPaginatorLength) {
                    end = page;
                    start = Math.max(1, end - length + 1);
                };
            } else {
                start = 0;
                end = -1;
            }

            table.paginator.$paginator = paginator.setPaginator(start, end, page);
            paginator.setPageClickEvents();
        },

        setPageClickEvents: function () {
            table.paginator.$paginator.on('click', 'li>a', function (e) {
                var page = $(e.target).html();
                table.paginator.$paginator.children('li').removeClass('active');
                $(e.target).parent().addClass('active');

                loadData(page, page == table.paginator.start || page == table.paginator.end);
            });
        }
    };

    return paginator;
};

module.exports = paginator;