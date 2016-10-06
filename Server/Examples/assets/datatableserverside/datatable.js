(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var dataLoader = require('../../../js/dataLoader.js');
var renderer = require('../../../js/renderer.js');

var features = (function (dataLoader, renderer) {
    'use strict';
    var _numberOfRows = 'number-of-rows';
    var _numberOfPages = 'number-of-pages';

    var features = {
        init: function (table) {
            table.events.onDataLoaded.push(renderNumberOfRows);
            table.events.onDataLoaded.push(renderNumberOfPages);
        }
    };

    function renderNumberOfRows(table) {
        var numberOfRows = table.store.numberOfRows;

        var containers = table.$table.find('[' + _numberOfRows + ']');

        for (var i = 0, l = containers.length; i < l; i += 1) {
            $(containers[i]).html(numberOfRows);
        }
    }

    function renderNumberOfPages(table) {
        var numberOfPages = table.store.numberOfPages;

        var containers = table.$table.find('[' + _numberOfPages + ']');

        for (var i = 0, l = containers.length; i < l; i += 1) {
            $(containers[i]).html(numberOfPages);
        }
    }

    return features;
} (dataLoader, renderer));

module.exports = features;
},{"../../../js/dataLoader.js":11,"../../../js/renderer.js":13}],2:[function(require,module,exports){
var renderer = require('../../../js/renderer.js');
var validator = require('../../../js/validator.js');

var editable = (function () {

    'use strict';
    var editable = {
        init: function (table, settings) {
            setOnClickEvents(table);
            configureSettings(table, settings);
        },

        // Replaces the content of a row with the edit template
        renderEditRow: function (table, $row) {
            $row.html(table.store.templates.editable.$template.html());
            // Fill inputs with the current values
            var $inputs = $row.find('.td-inner');
            var identifier = $row.attr('data-identifier');
            var rowData = table.store.pageData[identifier];
            Array.prototype.forEach.call($inputs, function (el) {
                var $el = $(el);
                $el.attr('value', rowData[$el.attr('data-name')]);
            }, this);

            var $allRows = table.$table.find('tr');
        },

        updateRow: function (table, $row, template) {
            var $inputs = $row.find('[data-name]');
            var postData = {};
            var identifier = $row.attr('data-identifier');
            Array.prototype.forEach.call($inputs, function (el) {
                var $el = $(el);
                var curColName = $el.attr('data-name');
                postData[curColName] = $el.prop('value') || $el.html();
            });

            var rowData = table.store.pageData[identifier];
            table.settings.editable.update(
                postData,
                // SUCCESS
                function () {
                    for (var prop in postData) {
                        rowData[prop] = postData[prop];
                    }
                },
                // ERROR
                function () {
                    // Igonore error.
                });
            var $updatedRow = renderer.renderRow(table, rowData, template || 'main');
            $row.html($updatedRow.html());

            return postData;
        }
    };

    function configureSettings(table, settings) {
        if (!settings.editable) return;
        validator.ValidateMustBeAFunction(settings.editable.update);
        table.settings.editable = Object.create(Object.prototype);
        table.settings.editable.update = settings.editable.update;
    }

    function setOnClickEvents(table) {
        table.$table.on('click', '[dt-btn-edit]', function (e) {
            var $row = $(this).parentsUntil('tr').parent();
            editable.renderEditRow(table, $row);
        });

        table.$table.on('click', '[dt-btn-update]', function (e) {
            var $row = $(this).parentsUntil('tr').parent();
            editable.updateRow(table, $row, $(this).attr('dt-btn-update'));
        });
    }

    return editable;
} ());

module.exports = editable;
},{"../../../js/renderer.js":13,"../../../js/validator.js":15}],3:[function(require,module,exports){
var dataLoader = require('../../../js/dataLoader.js');

var filterInitialiser = (function (dataLoader) {
    'use strict';

    return {
        init: function (table) {
            table.store.filter = [];
            filterInitialiser.setFilterEvent(table);
        },
        setFilterEvent: function (table) {
            var $filter = $(table.$table[0]).find('[filter]');
            // var $filter = $(table.$table[0].querySelectorAll('[filter]'));
            $filter.on('change', function () {
                var $target = $(this);
                var dictKey = this;
                var filterOperator = $target.attr('filter');
                var availableKeyElement;
                var keyIndex = -1;

                for (var index in table.store.filter) {
                    keyIndex += 1;
                    if (table.store.filter[index].key === dictKey) {
                        availableKeyElement = true;
                        break;
                    }
                }

                var keyToAdd = {
                    key: dictKey,
                    value: {
                        key: $target.attr('data-columnNames'),
                        operator: filterOperator || 'ci',
                        value: $target.val(),
                    }
                };

                if (availableKeyElement) {
                    table.store.filter[keyIndex] = keyToAdd;
                } else {
                    table.store.filter.push(keyToAdd);
                }

                dataLoader.loadData(table, 1);
            });
        }
    };
} (dataLoader));

module.exports = filterInitialiser;
},{"../../../js/dataLoader.js":11}],4:[function(require,module,exports){
var paginatorPredefinedTemplatesFactory = (function () {
    'use strict'

    return {
        getTemplate: function (templateNumber, configurations) {
            switch (templateNumber) {
                case "1":
                    return getTemplateA(configurations);

                case "2":
                    return getTemplateB(configurations);

                case "3":
                    return getTemplateC(configurations);

                default:
                    throw "Invalid paginator template number: " + templateNumber;
            }
        }
    };

    function getTemplateA(configurations) {
        var html = '<ul class="pagination pagination-sm">' +
            '<li dt-paginator-page><a href="#" dt-paginator-inner>1</a></li>' +
            '<li dt-paginator-page dt-active class="active"><a href="#" dt-paginator-inner>2</a></li>' +
            '<li dt-paginator-page><a href="#" dt-paginator-inner>3</a></li>' +
            '<li dt-paginator-page><a href="#" dt-paginator-inner>4</a></li>' +
            '<li dt-paginator-page><a href="#" dt-paginator-inner>5</a></li>' +
            '</ul>';

        return $.parseHTML(html);
    }

    // Large with first-last and previous-next buttons
    function getTemplateB(configurations) {
        var html =
            '<ul class="pagination pagination-lg">' +
            '<li class="page-item" dt-paginator-prev>' +
            '<a class="page-link" href="#" aria-label="Previous">' +
            '<span aria-hidden="true">&laquo;</span>' +
            '<span class="sr-only">Previous</span>' +
            '</a>' +
            '</li>' +
            '<li class="page-item" dt-paginator-first>' +
            '<a class="page-link" href="#">first</a>' +
            '</li>' +
            '<li class="page-item" dt-paginator-page>' +
            '<a dt-paginator-inner class="page-link" href="#">1</a>' +
            '</li>' +
            '<li class="page-item active" dt-paginator-page dt-active>' +
            '<a dt-paginator-inner class="page-link" href="#">2</a>' +
            '</li>' +
            '<li class="page-item" dt-paginator-last>' +
            '<a class="page-link" href="#">last</a>' +
            '</li>' +
            '<li class="page-item" dt-paginator-next>' +
            '<a class="page-link" href="#" aria-label="Next">' +
            '<span aria-hidden="true">&raquo;</span>' +
            '<span class="sr-only">Next</span>' +
            '</a>' +
            '</li>' +
            '</ul>';

        return $.parseHTML(html);
    }

    // Large with first-last and previous-next buttons
    function getTemplateC(configurations) {
        var html =
            '<ul class="pagination pagination-sm">' +
            '<li class="page-item" dt-paginator-prev>' +
            '<a class="page-link" href="#" aria-label="Previous">' +
            '<span aria-hidden="true">&laquo;</span>' +
            '<span class="sr-only">Previous</span>' +
            '</a>' +
            '</li>' +
            '<li class="page-item" dt-paginator-first>' +
            '<a class="page-link" href="#">first</a>' +
            '</li>' +
            '<li class="page-item" dt-paginator-page>' +
            '<a dt-paginator-inner class="page-link" href="#">1</a>' +
            '</li>' +
            '<li class="page-item active" dt-paginator-page dt-active>' +
            '<a dt-paginator-inner class="page-link" href="#">2</a>' +
            '</li>' +
            '<li class="page-item" dt-paginator-last>' +
            '<a class="page-link" href="#">last</a>' +
            '</li>' +
            '<li class="page-item" dt-paginator-next>' +
            '<a class="page-link" href="#" aria-label="Next">' +
            '<span aria-hidden="true">&raquo;</span>' +
            '<span class="sr-only">Next</span>' +
            '</a>' +
            '</li>' +
            '</ul>';

        return $.parseHTML(html);
    }

})();

module.exports = paginatorPredefinedTemplatesFactory;
},{}],5:[function(require,module,exports){
var validator = require('../../../js/validator.js');

var paginatorTemplate = (function () {
    // 'use strict'

    var paginatorTemplate = {
        init: function () {
            return this;
        },

        get paginatorLength() {
            return this._paginatorLength;
        },
        set paginatorLength(value) {
            validator.ValidateMustBeAPositiveNumber(value);
            this._paginatorLength = value;
        },

        get $template() {
            return this._$template;
        },
        set $template($value) {
            validator.ValidateMustBeAJqueryObject($value, "paginatorTemplate.$template");
            this._$template = $value;
        },

        get $commonPageTemplate() {
            return this._$commonPageTemplate;
        },
        set $commonPageTemplate($value) {
            validator.ValidateMustBeAJqueryObject($value, "paginatorTemplate.$commonPageTemplate");
            this._$commonPageTemplate = $value;
        },

        get $activePageTemplate() {
            return this._$activePageTemplate;
        },
        set $activePageTemplate($value) {
            validator.ValidateMustBeAJqueryObject($value, "paginatorTemplate.$activePageTemplate");
            this._$activePageTemplate = $value;
        }
    };

    return paginatorTemplate;
})();

module.exports = paginatorTemplate;
},{"../../../js/validator.js":15}],6:[function(require,module,exports){
var dataLoader = require('../../../js/dataLoader.js');
var paginatorTemplate = require('./paginatorTemplate.js');
var paginatorPredefinedTemplatesFactory = require('./paginatorPredefinedTemplatesFactory.js');

var paginatorTemplatesInitialiser = (function () {
    var _dtPaginator = 'dt-paginator';
    var _dtPaginatorLength = 'dt-paginator-length';
    var _paginatorDefaultLength = 5;

    var paginatorTemplatesInitialiser = {
        init: function (table, settings) {
            var $paginatorTemplates = table.$table.find('[dt-template=paginator]');
            var $paginatorPredefinedTemplateContainers = table.$table.find('[' + _dtPaginator + ']');

            if ($paginatorTemplates.length === 0 && $paginatorPredefinedTemplateContainers.length === 0) return;

            table.events.onTableInitializing.push(function () {
                $paginatorTemplates.toggle();
                $paginatorPredefinedTemplateContainers.toggle();
            });

            table.events.onTableInitialized.push(function () {
                $paginatorTemplates.toggle();
                $paginatorPredefinedTemplateContainers.toggle();
            });

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
                length: $curTempalteContainer.attr('dt-paginator-length') || _paginatorDefaultLength
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
        var length = Math.min(storeTemplate.paginatorLength, numberOfPages);
        if (length == 0) {
            length = 1; // Needed because the page container must not be removed completely. If there are no results one page wil be displayed
        }
        var halfLength = Math.floor((length - 1) / 2);
        var currentPaginatorLength = Math.min(storeTemplate.paginatorLength, numberOfPages);

        if (page <= (1 + halfLength)) {
            start = 1;
            end = length;
        } else if (1 + halfLength < page && page < numberOfPages - halfLength) {
            start = Math.max(Math.floor(page - halfLength), 1);
            end = Math.min(start + currentPaginatorLength - 1, numberOfPages);
        } else {
            start = numberOfPages - length + 1;
            end = numberOfPages;
        }

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
            currentTemplateStore.paginatorLength = $currentTemplate.attr('dt-paginator-length') || _paginatorDefaultLength;

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
},{"../../../js/dataLoader.js":11,"./paginatorPredefinedTemplatesFactory.js":4,"./paginatorTemplate.js":5}],7:[function(require,module,exports){
var validator = require('../../../js/validator.js');
var defaultSettings = require('../../../js/defaultSettings.js');
var dataLoader = require('../../../js/dataLoader.js');

var selectableInitialiser = (function () {
    var selectable = {
        init: function (table, settings) {
            if (!isSelectable(settings)) {
                return;
            }

            table.events.onTableRendered.push(selectable.refreshPageSelection);

            if (settings.selectable.onSelectedRowRendered) {
                table.events.onSelectedRowRendered.push(settings.selectable.onSelectedRowRendered);
            }

            if (settings.selectable.onNotSelectedRowRendered) {
                table.events.onNotSelectedRowRendered.push(settings.selectable.onNotSelectedRowRendered);
            }

            configure(table, settings);

            setEvents(table);
            setFunctions(table);
        },

        getSelected: function (table) {
            var seletedIdentifiers = [];
            var identifiers = table.store.selectable.identifiers;
            if (table.store.selectable.enable === false) {
                throw "The selectable option is disabled. You can enable it by setting the property settings.features.selectable.enable = true";
            }

            for (var identifier in identifiers) {
                var curIdentifier = identifiers[identifier];
                if (curIdentifier.selected === true) {
                    seletedIdentifiers.push(identifier);
                }
            }

            return seletedIdentifiers;
        },

        unselectAll: function (table, callback) {
            var numberOfModifiedRows = 0;
            var identifiers = table.store.selectable.identifiers;
            if (identifiers) {
                for (var prop in identifiers) {
                    if (identifiers[prop].selected == true) {
                        numberOfModifiedRows += 1;
                    }

                    identifiers[prop].selected = false;
                };

                this.refreshPageSelection(table);
                if (callback) callback();

                return numberOfModifiedRows;
            }
        },

        selectAll: function (table, callback) {
            dataLoader.loadIdentifiers(table, true, function (table) {
                selectable.refreshPageSelection(table);
                if (callback) callback();
            });
        },

        refreshPageSelection: function (table) {
            var tableRows = table.$table.find('tbody tr').slice();
            for (var i = 0, l = tableRows.length; i < l; i += 1) {
                var $row = $(tableRows[i]);
                var rowIdentifier = $row.attr('data-identifier');
                if (isSelected(table, rowIdentifier)) {
                    setRowSelectCssClasses(table, $row, true);

                    // Run events for selected
                    table.events.onSelectedRowRendered.forEach(function (event) {
                        event($row);
                    }, this);

                } else {
                    setRowSelectCssClasses(table, $row, false);

                    // Run events for not selected
                    table.events.onNotSelectedRowRendered.forEach(function (event) {
                        event($row);
                    }, this);

                }
            }
        }
    };

    function configure(table, settings) {
        table.store.selectable = {};
        table.store.selectable.identifiers = {};
        table.store.selectable.identifier = settings.selectable.identifier;
        // table.store.selectable.identifiers = null;
        table.store.selectable.requestIdentifiersOnDataLoad = true;
        table.store.selectable.multi = settings.selectable.multi;
        table.store.selectable.cssClasses = settings.selectable.cssClasses || 'active';
    }

    function setFunctions(table) {
        table.selectAll = function (callback) {
            selectable.selectAll(table, callback);
            selectable.refreshPageSelection(table);
        };

        table.unselectAll = function (callback) {
            selectable.unselectAll(table, callback);
        };
    }

    function setEvents(table) {
        var $tbody = table.$table.find('tbody');

        $tbody.on('click', function (e) {
            var $row = $(e.target).parentsUntil('tbody').last();
            var identifier = $row.attr('data-identifier');
            var rowIsSelected = isSelected(table, identifier);
            var numberOfSelectedRows;

            // No Ctrl && is not multiselect
            if (!e.ctrlKey || !table.store.selectable.multi) {
                numberOfSelectedRows = selectable.unselectAll(table);
            }

            if (rowIsSelected) {
                if (numberOfSelectedRows > 1) {
                    setIdentifierSelectStatus(table, identifier, true);
                } else {
                    setIdentifierSelectStatus(table, identifier, false);
                }
            } else {
                setIdentifierSelectStatus(table, identifier, true);
            }

            selectable.refreshPageSelection(table);
        });
    }

    function isSelectable(settings) {
        if (settings.selectable && settings.selectable.enable !== undefined) {
            validator.ValidateMustBeValidBoolean(settings.selectable.enable, 'settings.features.selectable.enable');
            return settings.selectable.enable;
        }

        return defaultSettings.features.selectable.enable;
    }

    function setRowSelectCssClasses(table, $row, isSelected) {
        var cssClasses = table.store.selectable.cssClasses;
        if (isSelected) {
            $row.addClass(cssClasses);
        } else {
            $row.removeClass(cssClasses);
        }
    }

    function isSelected(table, identifier) {
        var identifierObj = GetIdentifierObj(table, identifier);

        return identifierObj.selected;
    }

    function GetIdentifierObj(table, identifier) {
        if (table.store.selectable.identifiers[identifier] === undefined) {
            table.store.selectable.identifiers[identifier] = {};
        }

        var identifierObj = table.store.selectable.identifiers[identifier];

        return identifierObj;
    }

    function setIdentifierSelectStatus(table, identifier, selected) {
        var identifierObj = GetIdentifierObj(table, identifier);
        identifierObj.selected = selected;
    }

    return selectable;
})();

module.exports = selectableInitialiser;
},{"../../../js/dataLoader.js":11,"../../../js/defaultSettings.js":12,"../../../js/validator.js":15}],8:[function(require,module,exports){
var dataLoader = require('../../../js/dataLoader.js');

var sortable = (function (dataLoader) {
    'use strict';
    var _dtInner = 'dt-inner',
        _ascCssClasses = 'asc',
        _descCssClasses = 'desc',
        _dtName = 'data-name';

    return {
        init: function (table, settings) {
            var $sortables = table.$table.find('th[sortable]');
            $sortables.find('[' + _dtInner + ']').addClass('sortable both');
            table.store.$sortables = $sortables;
            configureSettings(table, settings);
            configureEvents(table, $sortables);
        },
    };

    function configureSettings(table, settings) {
        table.settings.sortable = {
            enable: true,
            ascCssClasses: _ascCssClasses,
            descCssClasses: _descCssClasses,
        };

        if (!settings.sortable) return;
        if (settings.sortable.enable === false) table.settings.sortable.enable = false;

        table.settings.sortable.ascCssClasses = settings.sortable.ascCssClasses || table.settings.sortable.ascCssClasses;
        table.settings.sortable.descCssClasses = settings.sortable.descCssClasses || table.settings.sortable.descCssClasses;
    }

    function configureEvents(table, $sortables) {
        if (!table.settings.sortable.enable) return;

        $sortables.on('click', function (e) {
            var $target = $(this);
            var name = $target.attr(_dtName);
            var isAsc = (table.orderBy && table.orderBy.Name == name) ? !table.orderBy.Asc : true;

            table.orderBy = {
                Name: name,
                Asc: isAsc
            };

            dataLoader.loadData(table, 1, function () {
                var sortable = table.settings.sortable;
                table.store.$sortables.find('[' + _dtInner + ']').removeClass(sortable.ascCssClasses + ' ' + sortable.descCssClasses);

                var $dtInner = $target.find('[' + _dtInner + ']');
                if (isAsc) {
                    $dtInner.addClass(sortable.ascCssClasses);
                    $dtInner.removeClass(sortable.descCssClasses);
                } else {
                    $dtInner.addClass(sortable.descCssClasses);
                    $dtInner.removeClass(sortable.ascCssClasses);
                }
            })
        });
    }
})(dataLoader);

module.exports = sortable;
},{"../../../js/dataLoader.js":11}],9:[function(require,module,exports){
var defaultSettings = require('../../../js/defaultSettings');

// =====================================================================
// Example Configuration:
// =====================================================================
//       spinner: {
//          enable: true, // default value is "true"
//          style: 2,
//          opacity: 0.2,
//          width: '200px'
//       }
// =====================================================================
var spinnerInitialiser = (function (defaultSettings) {
    'use strict';

    var spinnerInitialiser = {
        init: function (table, settings) {
            if (settings.spinner && settings.spinner.enable === false) {
                return;
            }

            configureSettings(table, settings);

            setSpinner(table);
            table.events.onDataLoading.push(renderSpinner);
        }
    };

    function setSpinner(table) {
        var width = table.settings.spinner.width;
        var opacity = table.settings.spinner.opacity;
        var spinnerStyle = table.settings.spinner.style;
        var $spinnerRow = $('<div/>');
        table.$table.children('tbody').css('position', 'relative');

        $spinnerRow.css('z-index', 0);
        $spinnerRow.css('position', 'absolute');
        $spinnerRow.css('width', '100%');
        $spinnerRow.css('top', '40%');
        $spinnerRow.css('border-style', 'none');
        $spinnerRow.css('text-align', 'center');

        var $image = $('<img/>');
        $image.attr('src', '/assets/datatableserverside/img/spinners/' + spinnerStyle + '.gif');
        $image.css('width', width);
        $image.css('position', 'relative');
        $image.css('margin', 'auto');
        $image.css('z-index', 1000);
        $image.css('opacity', opacity);

        $spinnerRow.append($image);
        table.settings.$spinner = $spinnerRow;
    }

    function renderSpinner(table) {
        var $tableBody = table.$table.find('tbody');
        // $tableBody.empty();
        $tableBody.append($('<tr/>'));
        $tableBody.append(table.settings.$spinner);
    }

    function configureSettings(table, settings) {
        table.settings.spinner = defaultSettings.spinner;
        if (!settings.spinner) return;
        table.settings.spinner.enable = settings.spinner.enable || defaultSettings.spinner.enable;
        table.settings.spinner.style = settings.spinner.style || defaultSettings.spinner.style;
        table.settings.spinner.width = settings.spinner.width || defaultSettings.spinner.width;
        table.settings.spinner.opacity = settings.spinner.opacity || defaultSettings.spinner.opacity;
    }

    return spinnerInitialiser;
} (defaultSettings));

module.exports = spinnerInitialiser;
},{"../../../js/defaultSettings":12}],10:[function(require,module,exports){
var selectable = require('../js/Features/Selectable/selectable.js');
var sortable = require('../js/Features/Sortable/sortableInitialiser.js');
var dataLoader = require('../js/dataLoader.js');
var filter = require('../js/Features/Filter/filterInitialiser.js');
var editable = require('../js/Features/Editable/editable');
var validator = require('../js/validator.js');
var settings = require('../js/settings.js');
var features = require('../js/Features/AdditionalFeatures/additionalFeatures.js');
var renderer = require('../js/renderer.js');
var spinner = require('../js/Features/Spinners/spinnerInitialiser.js');
var paginatorTemplate = require('../js/Features/PaginatorTemplates/paginatorTemplatesInitialiser.js');

window.dataTable = (function (selectable, sortable, dataLoader, filter,
    editable, validator, settingsExternal, features, renderer, spinner, paginatorTemplate) {
    'use strict'

    var table = {
        init: function (selector, settings) {
            this._$table = $(selector).first();

            // Settings
            this._settings = settingsExternal.init(settings);
            // Init objects
            configureEvents(this);
            configureStore(this);
            // Init Features
            spinner.init(this, settings);
            filter.init(table);
            sortable.init(table, settings);
            editable.init(this, settings);
            selectable.init(this, settings);
            features.init(this);
            renderer.init(this);
            paginatorTemplate.init(table, settings);

            executeOnTableInitializingEvents(this);

            dataLoader.loadData(table, 1, function () {
                executeOnTableInitializedEvents(table);
            });

            return this;
        },

        get settings() {
            return this._settings;
        },

        get paginator() {
            return this._paginator;
        },
        set paginator(val) {
            this._paginator = val;
        },

        get $table() {
            return this._$table;
        },

        get filter() {
            return table.store.filter;
        },

        getSelected: function () {
            return selectable.getSelected(this);
        },

        get columnPropertyNames() {
            return this._columnPropertyNames;
        }
    };

    function configureEvents(table) {
        table.events = Object.create(Object);
        table.events.onDataLoaded = [];
        table.events.onDataLoading = [];
        table.events.onTableRendered = [];
        table.events.onSelectedRowRendered = []; // someFunction($row);
        table.events.onNotSelectedRowRendered = []; // someFunction($row);
        table.events.onTableInitializing = [];
        table.events.onTableInitialized = [];
    }

    function configureStore(table) {
        table.store = {
            columnPropertyNames: getColumnPropertyNames(),
            pageData: null,
            data: {},
            requestIdentifiersOnDataLoad: false,
        };
    }

    function getColumnPropertyNames() {
        var colPropNames = [];
        var $columns = table.$table.find('thead th');
        for (var i = 0; i < $columns.length; i++) {
            var colName = $($columns[i]).attr('data-name');
            if (colName) {
                colPropNames.push(colName);
            }
        }

        return colPropNames;
    };

    function executeOnTableInitializingEvents(table) {
        table.events.onTableInitializing.forEach(function (event) {
            event(table);
        }, this);
    }

    function executeOnTableInitializedEvents(table) {
        table.events.onTableInitialized.forEach(function (event) {
            event(table);
        }, this);
    }

    return table;
})(selectable, sortable, dataLoader, filter, editable, validator, settings, features, renderer, spinner, paginatorTemplate);

module.exports = window.dataTable;
},{"../js/Features/AdditionalFeatures/additionalFeatures.js":1,"../js/Features/Editable/editable":2,"../js/Features/Filter/filterInitialiser.js":3,"../js/Features/PaginatorTemplates/paginatorTemplatesInitialiser.js":6,"../js/Features/Selectable/selectable.js":7,"../js/Features/Sortable/sortableInitialiser.js":8,"../js/Features/Spinners/spinnerInitialiser.js":9,"../js/dataLoader.js":11,"../js/renderer.js":13,"../js/settings.js":14,"../js/validator.js":15}],11:[function(require,module,exports){

var tableRenderer = require('../js/renderer.js');

var dataLoader = (function () {
    var dataLoader = {
        loadData: function (table, page, successCallback, errorCallback) {
            var getIdentifiers;

            // Execute onDataLoading events
            for (var index in table.events.onDataLoading) {
                table.events.onDataLoading[index](table);
            }

            var filter = formatFilterRequestValues(table.store.filter);

            getIdentifiers = false;

            $.ajax({
                url: table.settings.ajax.url,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: {
                    identifierPropName: table.store.selectable ? table.store.selectable.identifier : null,
                    getIdentifiers: getIdentifiers,
                    page: page,
                    pageSize: table.settings.paging.pageSize,
                    filter: JSON.stringify(filter),
                    orderBy: table.orderBy ? table.orderBy.Name : null,
                    asc: table.orderBy ? table.orderBy.Asc : true
                },
                success: function (data) {
                    // Add result to the dataTable object
                    refreshPageData(table, data.data, data.identifiers, data.rowsNumber, page);

                    // Invoke events on dataLoaded
                    for (var index in table.events.onDataLoaded) {
                        table.events.onDataLoaded[index](table);
                    }

                    tableRenderer.RenderTableBody(table, data.data);

                    // Invoke events on tableRendered
                    for (var index in table.events.onTableRendered) {
                        table.events.onTableRendered[index](table);
                    }

                    if (successCallback) successCallback(data);
                },
                error: function (err) {
                    table.$table.html(err.responseText);
                    if (errorCallback) errorCallback(err);
                }
            });
        },

        loadIdentifiers: function (table, areSelected, success, error) {
            var getIdentifiers = true;
            var filter = formatFilterRequestValues(table.store.filter);

            $.ajax({
                url: table.settings.ajax.url,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: {
                    identifierPropName: table.store.selectable ? table.store.selectable.identifier : null,
                    getIdentifiers: getIdentifiers,
                    page: 1,
                    pageSize: 1,
                    filter: JSON.stringify(filter),
                    orderBy: null,
                    asc: true
                },
                success: function (data) {
                    initIdentifiers(table, data.identifiers, areSelected);
                    if (success) success(table);
                },
                error: function (err) {
                    table.$table.html(err.responseText);
                    if (errorCallback) errorCallback(err);
                }
            });
        }
    };

    function formatFilterRequestValues(filterObj) {
        var filters = [];
        for (var filter in filterObj) {
            filters.push({
                key: filterObj[filter].value.key,
                value: {
                    operator: filterObj[filter].value.operator,
                    value: filterObj[filter].value.value
                }
            });
        }

        return filters;
    }

    function refreshPageData(table, data, identifiers, rowsNumber, currentPage) {
        var identifierPropName;
        var dataObj = {};

        identifierName = table.store.selectable ? table.store.selectable.identifier : null;

        table.store.currentPage = currentPage;

        for (var i = 0, l = data.length; i < l; i += 1) {
            var curDataRow = data[i];
            dataObj[curDataRow[identifierName] || i] = curDataRow;
        }
        table.store.pageData = dataObj;

        table.store.numberOfRows = rowsNumber;
        if (table.settings.paging.enable) {
            table.store.numberOfPages = Math.ceil(rowsNumber / table.settings.paging.pageSize);
        }

        initIdentifiers(table, identifiers);
    }

    function initIdentifiers(table, identifiers, areSelected) {
        if (!identifiers) {
            return;
        }

        table.store.selectable.identifiers = {};

        for (var i = 0, l = identifiers.length; i < l; i += 1) {
            table.store.selectable.identifiers[identifiers[i]] = {
                selected: areSelected,
            };
        }
    }

    return dataLoader;
} ());

module.exports = dataLoader;
},{"../js/renderer.js":13}],12:[function(require,module,exports){
var defaultSettings = (function () {
    var defaultSettings = {
        pageSize: 10,

        paginator: {
            length: 5
        },

        features: {
            selectable: {
                enable: false,
                multi: false,
                cssClasses: 'active',
            }
        },

        spinner: {
            enable: true,
            style: 0,
            width: '100px',
            opacity: 1,
        }
    };

    return defaultSettings;
})();

module.exports = defaultSettings;
},{}],13:[function(require,module,exports){
var selectable = require('../js/Features/Selectable/selectable.js');

var renderer = (function (selectable) {
    'use strict';

    var renderer = {

        init: function (table) {
            setButtonEvents(table);
            setTemplates(table);
        },

        // Renders table cell. If there is a custom defined render function calls it first.
        renderCell: function (table, colName, content, rowData) {
            if (table.settings && table.settings.columns && table.settings.columns[colName] && table.settings.columns[colName].render) {
                return table.settings.columns[colName].render(content, rowData);
            };

            return content;
        },

        renderRow: function (table, rowData, templateName, index) {
            var identifierPropName = table.store.selectable ? table.store.selectable.identifier : null;
            var identifier = rowData[identifierPropName] || index;
            var $row;
            var propValue, $template;

            if (templateName != undefined && table.store.templates.main) {
                var $containers = table.store.templates[templateName].$containers;
                for (var i = 0, l = $containers.length; i < l; i += 1) {
                    var $container = $($containers[i]);
                    var propName = $container.attr('data-name');
                    var propValue = rowData[propName];
                    var isNoCustomrRender = $container.attr('no-custom-render') !== undefined;
                    var cellData = isNoCustomrRender ? propValue : renderer.renderCell(table, propName, propValue, rowData);
                    var attributeValue = $container.attr('value');
                    if (typeof attributeValue === typeof undefined || attributeValue === false) {
                        $container.html(cellData);
                    } else {
                        $container.attr('value', cellData);
                    }
                }

                $row = table.store.templates[templateName].$template.clone();
            } else {
                // If there is no main template provided the renderer will render the cells directly into the td elements
                $row = $('<tr>');
                for (var col = 0, l = table.store.columnPropertyNames.length; col < l; col++) {
                    var propName = table.store.columnPropertyNames[col];

                    if (!propName) {
                        throw 'Missing column name. Each <th> in the data table htm element must have an attribute "data-name"'
                    }

                    propValue = rowData[propName];

                    var $col = $('<td>').html(renderer.renderCell(table, propName, propValue, rowData));
                    $row.append($col);
                }
            }

            $row.attr('data-identifier', identifier);

            return $row;
        },

        RenderTableBody: function (table, data) {
            var $tbody = table.$table.find('tbody').empty();
            var buffer = [];
            for (var row = 0; row < data.length; row++) {
                var rowData = data[row];
                var $row = renderer.renderRow(table, rowData, 'main', row);
                buffer.push($row);
            }

            $tbody.append(buffer);
        }
    };

    function setTemplates(table) {
        table.store.templates = {};
        var $templatesOrigin = table.$table.find('table[dt-table] tr[dt-template]');
        $templatesOrigin.remove();
        var $templates = $templatesOrigin.clone();
        if ($templates.length != 0) {
            Array.prototype.forEach.call($templates, function (el) {
                var $el = $(el);
                var template = {};
                template.$template = $el;
                template.$containers = $el.find('[data-name]');
                table.store.templates[$el.attr('dt-template')] = template;
                $el.removeAttr('dt-template');
            });
        }
    }

    function setButtonEvents(table) {
        table.$table.on('click', '[dt-btn-template]', function () {
            var $this = $(this);
            var $curRow = $this.parentsUntil('tr').parent();
            var identifier = $curRow.attr('data-identifier');
            var rowData = table.store.pageData[identifier];
            var $rowFromTemplate = renderer.renderRow(table, rowData, $(this).attr('dt-btn-template'));

            // fade in the new template
            var delay = $this.attr('dt-delay') || 0;
            $($curRow).fadeOut(0, 0);
            $curRow.html($rowFromTemplate.html());
            $($curRow).fadeIn(parseInt(delay));
        });
    }

    return renderer;
} (selectable));

module.exports = renderer;
},{"../js/Features/Selectable/selectable.js":7}],14:[function(require,module,exports){
var defaultSettings = require('../js/defaultSettings.js');
var validator = require('../js/validator.js');

var settings = (function (defaultSettings, validator) {
    var settings = {
        init: function (settings) {
            validator.ValidateValueCannotBeNullOrUndefined(settings, 'settings', 'The configuration object argument is missing from the datatable init() function constructor.');

            // Init default values
            this.paging = {
                enable: true,
                pageSize: defaultSettings.pageSize
            };
            this.paginator = defaultSettings.paginator;
            this.features = defaultSettings.features;

            // Set custom values
            setCustomPaging.call(this, settings.paging);
            setCustomColumns.call(this, settings.columns);
            setCustomEditable.call(this, settings.editable);
            setCustomSelectable.call(this, settings.selectable);

            this.ajax = settings.ajax;

            return this;
        },

        get paginator() {
            return this._paginator;
        },
        set paginator(val) {
            this._paginator = val;
        },

        get features() {
            return this._features;
        },
        set features(val) {
            this._features = val;
        },

        get selectable() {
            return this._selectable;
        },
        set selectable(value) {
            this._selectable = value;
        },

        get ajax() {
            return this._ajax;
        },
        set ajax(val) {
            validator.ValidateValueCannotBeNullOrUndefined(val, "ajax", "The ajax propery of the settings object is required");
            validator.ValidateValueCannotBeNullOrUndefined(val.url, "ajax.url");

            this._ajax = val;
        },

        get columns() {
            return this._columns;
        },
        set columns(val) {
            if (!val) return;
            for (var prop in val) {
                if (val[prop].render) {
                    validator.ValidateMustBeAFunction(val[prop].render, "columns." + prop + ".render()");
                }
            }

            this._columns = val;
        }
    };

    function setCustomSelectable(selectable) {
        this.selectable  = selectable;
    }

    function setCustomPaging(paging) {
        if (!paging) return;
        if (paging.pageSize) {
            this.paging.pageSize = paging.pageSize;
        }

        if (paging.enable != undefined && paging.enable === false) {
            this.paging.enable = false;
        } else {
            paging.enable = true;
        }
    }

    function setCustomColumns(columns) {
        if (!columns) return;
        this.columns = columns;
    }

    function setCustomEditable(editable) {
        if (!editable) return;
        validator.ValidateMustBeAFunction(editable.update);
        this.editable = Object.create(Object.prototype);
        this.editable.update = editable.update;
    }

    return settings;
})(defaultSettings, validator);

module.exports = settings;
},{"../js/defaultSettings.js":12,"../js/validator.js":15}],15:[function(require,module,exports){
var validator = (function () {
    var validator = {
        ValidateValueCannotBeNullOrUndefined: function (val, name, message) {
            if (val === null || val === undefined) {
                throw message || "Value cannot be null or undefined. Parameter name: \"" + name + "\".";
            }
        },

        ValidateShouldBeANumber: function (val, name, message) {
            if (!typeof (val) === 'number') {
                throw message || 'The value of ' + name + ' must be a number';
            }
        },

        ValidateMustBeAPositiveNumber: function (val, name, message) {
            this.ValidateShouldBeANumber(val);
            if (val < 0) {
                throw message || 'The value of ' + name + ' must be a positive number';
            }
        },

        ValidateMustBeValidBoolean: function (val, name, message) {
            this.ValidateValueCannotBeNullOrUndefined(val);
            if (typeof (val) !== 'boolean') {
                throw message || 'The value of ' + name + ' must be a valid boolean.';
            }
        },

        ValidateMustBeValidStringOrNull: function (val, name, message) {
            if (!val) return;
            if (typeof (val) !== 'string') {
                throw message || 'The value of ' + name + ' must be a valid string';
            }
        },

        ValidateMustBeValidString: function (val, name, message) {
            this.ValidateValueCannotBeNullOrUndefined(val, name, message);
            this.ValidateMustBeValidStringOrNull(val, name, message);
        },

        ValidateMustBeAFunction: function (val, name, message) {
            validator.ValidateValueCannotBeNullOrUndefined(val, name, message);
            if (typeof (val) !== 'function') {
                throw message || 'The type of ' + name + ' must be a function.';
            }
        },

        ValidateMustBeAJqueryObject(val, name, message) {
            if (!(val instanceof $)) {
                throw message || name + " must be a valid jQuery object.";
            }   
        }
    };

    return validator;
})();

module.exports = validator;
},{}]},{},[10]);
