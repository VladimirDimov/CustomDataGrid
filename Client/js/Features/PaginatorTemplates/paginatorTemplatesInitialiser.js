var dataLoader = require('../../../js/dataLoader.js');
var paginatorTemplate = require('./paginatorTemplate.js');
var paginatorPredefinedTemplatesFactory = require('./paginatorPredefinedTemplatesFactory.js');

var paginatorTemplatesInitialiser = (function () {
    var _dtPaginator = 'dt-paginator';
    var _dtPaginatorLength = 'dt-paginator-length';

    var paginatorTemplatesInitialiser = {
        init: function (table) {
            var $paginatorTemplates = table.$table.find('[dt-template=paginator]');
            var $paginatorPredefinedTemplateContainers = table.$table.find('[' + _dtPaginator + ']');
            if ($paginatorTemplates.length === 0 && $paginatorPredefinedTemplateContainers.length === 0) return;

            setPaginatorTemplateElements(table, $paginatorTemplates);

            var predefinedTemplates = getPredefinedTemplates($paginatorPredefinedTemplateContainers);
            setPaginatorTemplateElements(table, predefinedTemplates);

            table.events.onDataLoaded.push(updatePaginators);
            setPageClickEvents(table);
        }
    };

    function getPredefinedTemplates($paginatorPredefinedTemplateContainers) {
        var predefinedTemplates = [];

        $paginatorPredefinedTemplateContainers.each(function (i) {
            var $curTempalteContainer = $($paginatorPredefinedTemplateContainers[i]);
            var tempalteNumber = $curTempalteContainer.attr(_dtPaginator);
            var config = {
                length: $curTempalteContainer.attr('dt-paginator-length')
            };

            var $curTemplate = paginatorPredefinedTemplatesFactory.getTemplate(tempalteNumber, config);
            $curTempalteContainer.append($curTemplate);
            predefinedTemplates.push($curTempalteContainer);
        });

        return predefinedTemplates;
    }

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
        var $newPageItem;
        var $template = storeTemplate.$template;
        var newPageItems = [];
        for (var i = start; i <= end; i++) {
            if (i != currentPage) {
                $newPageItem = storeTemplate.$commonPageTemplate.clone();
            } else {
                $newPageItem = storeTemplate.$activePageTemplate ?
                    storeTemplate.$activePageTemplate.clone() :
                    storeTemplate.$commonPageTemplate.clone();
            }
            var innerPageElement = $newPageItem.find('[dt-paginator-inner]');
            innerPageElement.html(i);
            newPageItems.push($newPageItem);
        }

        var $newPageItems = $(newPageItems).map(function () { return this.toArray(); });
        var $existingPageItems = $template.find('[dt-paginator-page]');
        var $pageItemsToRemove = $(Array.prototype.slice.call($existingPageItems, 1, $existingPageItems.length));
        $pageItemsToRemove.remove();
        $existingPageItems.replaceWith($newPageItems);
    }

    function setPaginatorTemplateElements(table, $paginatorTemplates) {
        table.store.paginatorTemplates = table.store.paginatorTemplates || [];
        for (var i = 0, length = $paginatorTemplates.length; i < length; i += 1) {
            var $currentTemplate = $($paginatorTemplates[i]);
            var currentTemplateStore = Object.create(paginatorTemplate).init();
            var $pageItemsWithoutActive = $currentTemplate.find('[dt-paginator-page]:not([dt-active])');
            var $allPageItems = $currentTemplate.find('[dt-paginator-page]');
            currentTemplateStore.paginatorLength = $currentTemplate.attr('dt-paginator-length') || $allPageItems.length;

            // Set active page template
            var $activePageTemplate = $currentTemplate.find('[dt-active]');
            if ($activePageTemplate.length != 0) {
                currentTemplateStore.$activePageTemplate = $activePageTemplate.first().clone();
            } else {
                currentTemplateStore.$activePageTemplate = $pageItemsWithoutActive.first();
            }

            // Set not active page template
            if ($pageItemsWithoutActive.length > 0) {
                currentTemplateStore.$commonPageTemplate = $pageItemsWithoutActive.first();
                var $pageItemsToRemove = $(Array.prototype.slice.call($pageItemsWithoutActive, 1, $pageItemsWithoutActive.length));
                $pageItemsToRemove.remove();
            }

            currentTemplateStore.$template = $currentTemplate;
            table.store.paginatorTemplates.push(currentTemplateStore);
        }
    }

    function setPageClickEvents(table) {
        table.$table.on('click', '[dt-paginator-inner]', function () {
            var $this = $(this);
            var page = $this.html();

            dataLoader.loadData(table, page);
        });

        table.$table.find('[dt-paginator-next]').on('click', function () {
            var currentPage = parseInt(table.store.currentPage);
            if (currentPage == table.store.numberOfPages) return;

            dataLoader.loadData(table, currentPage + 1);
        });

        table.$table.find('[dt-paginator-prev]').on('click', function () {
            var currentPage = parseInt(table.store.currentPage);
            if (currentPage == 1) return;

            dataLoader.loadData(table, currentPage - 1);
        });

        table.$table.find('[dt-paginator-first]').on('click', function () {
            var currentPage = parseInt(table.store.currentPage);

            dataLoader.loadData(table, 1);
        });

        table.$table.find('[dt-paginator-last]').on('click', function () {
            var currentPage = parseInt(table.store.currentPage);
            if (table.store.numberOfPages == 0) return;

            dataLoader.loadData(table, table.store.numberOfPages);
        });
    }

    return paginatorTemplatesInitialiser;
})();

module.exports = paginatorTemplatesInitialiser;