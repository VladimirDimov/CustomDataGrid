var paginatorTemplate = (function () {
    var paginatorTemplate = {
        init: function (table) {
            var $paginatorTemplates = table.$table.find('[dt-template=paginator]');
            if ($paginatorTemplates.length == 0) return;

            setPaginatorTemplateElements(table, $paginatorTemplates);
            table.events.onDataLoaded.push(updatePaginators);
        }
    };

    function updatePaginators(table) {
        var paginatorTemplates = table.store.paginatorTemplates;
        for (i = 0, length = paginatorTemplates.length; i < length; i += 1) {
            updatePaginator(table, paginatorTemplates[i]);
        }
    }

    function updatePaginator(table, storeTemplate) {
        var page = table.store.currentPage || 1;
        var numberOfPages = Math.ceil(table.store.numberOfRows / table.settings.paging.pageSize)
        var start, end;
        var length = table.settings.paginator.length;
        var halfLength = Math.floor((length - 1) / 2);
        var currentPaginatorLength = Math.min(storeTemplate.paginatorLength, numberOfPages);

        start = Math.max(Math.floor(page - halfLength), 1);
        end = Math.min(start + currentPaginatorLength - 1, numberOfPages);

        renderPaginator(table, storeTemplate, page, start, end);
    }

    function renderPaginator(table, storeTemplate, currentPage, start, end) {
        var $template = storeTemplate.$template;
        var newPageItems = [];
        for (var i = start; i <= end; i++) {
            var $newPageItem = storeTemplate.$pageItem.clone();
            var innerPageElement = $newPageItem.find('[dt-paginator-page]');
            innerPageElement.html(i);
            newPageItems.push($newPageItem);
        }

        var $newPageItems = $(newPageItems).map(function () { return this.toArray(); });
        debugger;
        var $pageItemToReplace = $template.find('[dt-paginator-item]');
        $pageItemToReplace.replaceWith($newPageItems);
        debugger;
    }

    function setPaginatorTemplateElements(table, $paginatorTemplates) {
        table.store.paginatorTemplates = [];
        for (var i = 0, length = $paginatorTemplates.length; i < length; i += 1) {
            var $currentTemplate = $($paginatorTemplates[i]);
            table.store.paginatorTemplates[$currentTemplate] = {};
            var currentTemplateStore = {};
            var $pageItems = $currentTemplate.find('[dt-paginator-item]');
            currentTemplateStore.paginatorLength = $pageItems.length;
            if ($pageItems.length > 0) {
                currentTemplateStore.$pageItem = $pageItems.first();
                var $pageItemsToRemove = $(Array.prototype.slice.call($pageItems, 1, $pageItems.length));
                $pageItemsToRemove.remove();
            }

            currentTemplateStore.$template = $currentTemplate;
            table.store.paginatorTemplates.push(currentTemplateStore);
        }
    }

    return paginatorTemplate;
})();

module.exports = paginatorTemplate;