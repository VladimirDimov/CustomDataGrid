var paginator = function (table) {
    var dataLoader = require('../js/dataLoader.js');

    var paginator = {
        setPaginator: function (start, end, activePage) {
            table.paginator.start = start;
            table.paginator.end = end;

            var $footer = table._$table.children('tfoot').first();
            $footer.children('.pagination').remove();
            var $paginator = $('<ul></ul>')
                .addClass('pagination');

            $footer.append($paginator);

            if (table.paginator.start > 1) {
                var $firstPageElement = $('<li><a href="#" page-first>' + 1 + '</a></li>');
                var $previousPageElement = $('<li><a href="#" page-previous>' + '...' + '</a></li>');
                $paginator.append($firstPageElement);
                $paginator.append($previousPageElement);
            }
            for (var i = start; i <= end; i++) {
                var $currentPageElement = $('<li><a href="#" page>' + i + '</a></li>');
                $paginator.append($currentPageElement);
                if (i == activePage) $currentPageElement.addClass('active');
            }

            if (table.paginator && table.store && table.paginator.end < table.store.numberOfPages) {
                var $nextPageElement = $('<li><a href="#" page-next>' + '...' + '</a></li>');
                var $lastPageElement = $('<li><a href="#" page-last>' + (table.store ? table.store.numberOfPages : "") + '</a></li>');
                $paginator.append($nextPageElement);
                $paginator.append($lastPageElement);
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
        },

        setPageClickEvents: function () {
            table.$table.on('click', '.pagination li>a[page], li>a[page-first], li>a[page-last]', function (e) {
                var page = $(e.target).html();

                var isUpdatePagnator =
                    page == table.paginator.start ||
                    page == table.paginator.end ||
                    page == 1 || page == table.store.numberOfPages;
                table.paginator.currentPage = page;
                table.paginator.$paginator.children('li').removeClass('active');
                dataLoader.loadData(table, page, isUpdatePagnator)
                    .then(function () {
                        $(e.target).parent().addClass('active');
                    });
            });

            table.$table.on('click', 'li>a[page-next]', function (e) {
                var page = parseInt(table.paginator.currentPage) + 1;
                table.paginator.currentPage = page;

                dataLoader.loadData(table, page, true);
            });

            table.$table.on('click', 'li>a[page-previous]', function (e) {
                var page = parseInt(table.paginator.currentPage) - 1;
                table.paginator.currentPage = page;

                dataLoader.loadData(table, page, true);
            });
        }
    };

    return paginator;
};

module.exports = paginator;