(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// // Some code
var vDataTable = require('../js/data-table.js');

var tb = vDataTable().init('#table', {
  ajax: {
    url: 'http://localhost:65219/home/indexDB'
  },
  columns: {
    Salary: {
      render: function (content) {
        return '**' + content + '$$$**';
      }
    },
    Actions: {
      render: function () {
        return '<button class="btn-edit">Edit</button>' +
          '<button class="btn-save">Save</button>';
      }
    }
  },
  
  features: {
    identifier: 'Id',
    selectable: {
      active: true,
      cssClasses: 'row-selected'
      // selectFunction: function ($row) {
      //   // return $row.children().first('td').html();
      // }
    },
    editable: {
      columns: {
        FirstName: {
          edit: function ($td) {
            var val = $td.html();
            var $input = $('<input>');
            $input.val(val);
            $td.html($input);
          },

          save: function ($td) {
            var val = $td.find('input').first().val();

            return val;
          }
        },
        LastName: {
          edit: function ($td) {
            var val = $td.html();
            var $input = $('<input>');
            $input.val(val);
            $td.html($input);
          },

          save: function ($td) {
            var val = $td.find('input').first().val();

            return val;
          }
        }
      },

      update: function (data) {
        console.log(data);
      }
    }
  }
});

$('table').on('click', function (e) {
  if (!$(e.target).hasClass('btn-edit')) return;
  var $row = $(e.target).parent().parent();

  tb.edit($row);
});

$('table').on('click', function (e) {
  if (!$(e.target).hasClass('btn-save')) return;
  var $row = $(e.target).parent().parent();
  tb.save($row)
});

$('#btnGetSelected').on('click', function () {
  var selectedIdentifiers = tb.getSelected();
  console.log(selectedIdentifiers);
});

$('#selectAll').on('click', function () {
  tb.selectAll();
});

$('#unselectAll').on('click', function () {
  tb.unselectAll();
});
},{"../js/data-table.js":2}],2:[function(require,module,exports){
dataTable = function () {
  'use strict'
  var selectable = require('../js/selectable.js');
  var sortable = require('../js/sortable.js');
  var dataLoader = require('../js/dataLoader.js');
  var paginator = require('../js/paginator.js');
  var filter = require('../js/filter.js');
  var editable = require('../js/editable');


  var defaultSettings = {
    pageSize: 9,
    paginator: {
      length: 10
    },
    features: {
      enableFilter: true,
      selectable: {
        active: true,
        cssCasses: 'dt-row-selected',
      }
    },
    colors: {
      // No colors yet
    }
  };

  var table = {
    init: function (selector, settings) {
      var tb = {};
      this._$table = $(selector).first();
      this._$table._currentPage = 1;

      // Paginator settings
      this._paginator = {};
      this._paginator.currentPage = 1;
      this._paginator.length = settings.paginator ? settings.paginator.length : defaultSettings.paginator.length;
      this._paginator.$paginator = paginator(this).setPaginator(1, this._paginator.length, 1);

      this._columnPropertyNames = setColumnPropertyNames();

      // Data
      this.store = {
        filter: new Object(),
        selectedRows: [],
        identifiers: null,
        pageData: null
      };

      // Settings
      this._settings = {
        ajax: {
          url: settings.ajax.url
        },
        colors: {
          selectedRow: (settings.colors ? selectedRow : null) || defaultSettings.colors.selectedRow,
        },
        pageSize: settings.pageSize || defaultSettings.pageSize,
        features: {
          identifier: settings.features.identifier,
          selectable: settings.features.selectable,
          editable: settings.features.editable
        },
        columns: settings.columns || {}
      }

      paginator(this).setPageClickEvents();
      filter.setFilterEvent(this);
      sortable.formatSortables(this);
      dataLoader.loadData(table, 1, true);

      if (settings.features) {
        processFeatures(settings.features);
      };

      return this;
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

  function processFeatures(features) {
    if (features.selectable.active && features.selectable.active == true) {
      selectable.makeSelectable(table);
    };

    if (features.editable) {
      editable.init(table);
    }
  }

  function setColumnPropertyNames() {
    var colPropNames = [];
    var $columns = table.$table.find('thead tr:last-child').children();
    for (var i = 0; i < $columns.length; i++) {
      colPropNames.push($($columns[i]).attr('data-name'));
    }

    return colPropNames;
  };

  return table;
};

module.exports = dataTable;
},{"../js/dataLoader.js":3,"../js/editable":4,"../js/filter.js":5,"../js/paginator.js":6,"../js/selectable.js":7,"../js/sortable.js":8}],3:[function(require,module,exports){

var dataLoader = (function () {
    var paginator = require('../js/paginator.js');
    var selectable = require('../js/selectable.js');
    var tableRenderer = require('../js/table-renderer.js');

    var dataLoader = {
        loadData: function (table, page, isUpdatePaginator) {
            paginator(table).updatePaginator = paginator(table).updatePaginator || true;
            $.ajax({
                url: table.settings.ajax.url,
                data: {
                    identifierPropName: table.settings.features.identifier,
                    getIdentifiers: table.store.identifiers === null,
                    page: page,
                    pageSize: table.settings.pageSize,
                    filter: JSON.stringify(table.store.filter),
                    orderBy: table.orderBy ? table.orderBy.Name : null,
                    asc: table.orderBy ? table.orderBy.Asc : true
                },
                success: function (data) {
                    refreshPageData(table, data.data, data.identifiers, data.rowsNumber);

                    if (isUpdatePaginator) {
                        paginator(table).updatePaginator(page, Math.ceil(data.rowsNumber / table.paginator.length));
                    }
                },
                error: function(err) {
                    throw err;
                }
            });
        }
    };

    function refreshPageData(table, data, identifiers, rowsNumber) {
        table.store.pageData = data;
        table.store.numberOfRows = rowsNumber;
        table.store.numberOfPages = Math.ceil(rowsNumber / table._paginator.length);

        tableRenderer.renderNumberOfRows(table);
        tableRenderer.renderNumberOfPages(table);

        var $tbody = table.$table.children('tbody').empty();
        // TODO: To foreach the table._columnPropertyNames instead of the response data columns

        for (var row = 0; row < data.length; row++) {
            var rowData = data[row];
            var identifier = rowData[table.settings.features.identifier];
            var $row = tableRenderer.renderRow(table, rowData);
            $tbody.append($row);

            if (table.store.identifiers != null) {
                formatRowSelected(table, $row, identifier);
            }

            if (table.store.identifiers === null) {
                selectable.initIdentifiers(table, identifiers);
            }
            // var $row = tableRenderer.renderRow(table, rowData, identifiers);
        }
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
},{"../js/paginator.js":6,"../js/selectable.js":7,"../js/table-renderer.js":9}],4:[function(require,module,exports){
var editable = (function () {
    var tableRenderer = require('../js/table-renderer.js');

    'use strict';
    var editable = {
        init: function (table) {
            table.edit = function ($row) {
                var $tds = $row.find('td');
                for (var editObj in table.settings.features.editable.columns) {
                    var colIndex = getColumnIndex(table, editObj);
                    table.settings.features.editable.columns[editObj].edit($($tds[colIndex]));
                }
            };

            table.save = function ($row) {
                var $tds = $row.find('td');
                var pageData = table.store.pageData;
                var identifierName = table.settings.features.identifier;
                var identifierVal = $row.attr('data-identifier');
                var rowData = pageData.filter(function (item) {
                    return item[identifierName] == identifierVal;
                })[0];

                for (var editObj in table.settings.features.editable.columns) {
                    var colIndex = getColumnIndex(table, editObj);
                    var content = table.settings.features.editable.columns[editObj].save($($tds[colIndex]));
                    rowData[editObj] = content;
                }

                update(table, rowData);
                renderRow(table, rowData);
            };
        },
    };


    function update(table, rowData) {
        table.settings.features.editable.update(rowData);
    }


    function renderRow(table, rowData) {
        var identifierName = table.settings.features.identifier;
        var identifierVal = rowData[identifierName];
        var $row = table.$table.find('tr[data-identifier=' + identifierVal + ']');
        var $newRow = tableRenderer.renderRow(table, rowData);
        $row.html($newRow.html());
    }

    function getColumnIndex(table, colName) {
        return table.columnPropertyNames.indexOf(colName);
    }

    return editable;
} ());

module.exports = editable;
},{"../js/table-renderer.js":9}],5:[function(require,module,exports){
var filter = (function () {
    'use strict';
    var dataLoader = require('../js/dataLoader.js');

    return {
        setFilterEvent: function (table) {
            var $filter = $(table.$table[0]).find('[filter]');
            $filter.on('change', function () {
                var $target = $(this);
                var dictKey = $target.attr('data-props');
                var filterOperator = $target.attr('filter');
                var dictValue = $target.val();
                table.store.filter[dictKey] = { value: dictValue, operator: filterOperator || 'ci' };
                dataLoader.loadData(table, 1, true);
            });
        }
    };
} ());

module.exports = filter;
},{"../js/dataLoader.js":3}],6:[function(require,module,exports){
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
            paginator.setPageClickEvents(this);
        },

        setPageClickEvents: function () {
            table.paginator.$paginator.on('click', 'li>a[page], li>a[page-first], li>a[page-last]', function (e) {
                var page = $(e.target).html();
                table.paginator.$paginator.children('li').removeClass('active');
                table.paginator.currentPage = page;
                $(e.target).parent().addClass('active');

                var isUpdatePagnator =
                    page == table.paginator.start ||
                    page == table.paginator.end ||
                    page == 1 || page == table.store.numberOfPages;

                dataLoader.loadData(table, page, isUpdatePagnator);
            });

            table.paginator.$paginator.on('click', 'li>a[page-next]', function (e) {
                var page = parseInt(table.paginator.currentPage) + 1;
                table.paginator.$paginator.children('li').removeClass('active');
                table.paginator.currentPage = page;
                $(e.target).parent().addClass('active');

                dataLoader.loadData(table, page, true);
            });

            table.paginator.$paginator.on('click', 'li>a[page-previous]', function (e) {
                var page = parseInt(table.paginator.currentPage) - 1;
                table.paginator.$paginator.children('li').removeClass('active');
                table.paginator.currentPage = page;
                $(e.target).parent().addClass('active');

                dataLoader.loadData(table, page, true);
            });
        }
    };

    return paginator;
};

module.exports = paginator;
},{"../js/dataLoader.js":3}],7:[function(require,module,exports){
var selectable = (function () {
    var selectable = {
        makeSelectable: function (table) {
            var $tbody = table.$table.find('tbody');

            $tbody.on('click', function (e) {
                $row = $(e.target).parentsUntil('tbody').last();
                var identifier = $row.attr('data-identifier');
                if (!e.ctrlKey && !isSelected(table, $row)) {
                    // $tbody.find('tr').css('background-color', 'white');
                    setRowSelectCssClasses(table, $tbody.find('tr'), false);
                    selectable.unselectAll(table);
                }

                if (isSelected(table, $row)) {
                    RemoveFromArray($row[0], table.store.selectedRows);
                    setIdentifierSelectStatus(table, identifier, false);
                    // $row.css('background-color', 'white');
                    setRowSelectCssClasses(table, $row, true);
                } else {
                    setIdentifierSelectStatus(table, identifier, true);
                    // $row.css('background-color', 'gray');
                    setRowSelectCssClasses(table, $row, true);
                }
            });

            table.selectAll = function () {
                selectable.selectAll(table);
                refreshPageSelection(table);
            };

            table.unselectAll = function () {
                selectable.unselectAll(table);
            };
        },

        getSelected: function (table) {
            var selectedIdentifiers = table.store.identifiers.filter(function (elem) {
                return elem.selected === true;
            }).map(function (elem) {
                return elem.identifier;
            });

            console.log(selectedIdentifiers);
        },

        initIdentifiers(table, identifiers) {
            table.store.identifiers = [];

            for (var i = 0, l = identifiers.length; i < l; i += 1) {
                table.store.identifiers.push({
                    selected: false,
                    identifier: identifiers[i]
                });
            }
        },

        unselectAll: function (table) {
            if (table.store.identifiers) {
                table.store.identifiers.map(function (elem) {
                    elem.selected = false;

                    return elem;
                });

                refreshPageSelection(table);
            }
        },

        selectAll: function (table) {
            if (table.store.identifiers) {
                table.store.identifiers.map(function (elem) {
                    elem.selected = true;

                    return elem;
                });
            }
        }
    };

    function setRowSelectCssClasses(table, $row, isSelected) {
        var cssClasses = table.settings.features.selectable.cssClasses;
        if (isSelected) {
            $row.addClass(cssClasses);
        } else {
            $row.removeClass(cssClasses);
        }
    }

    function refreshPageSelection(table) {
        var tableRows = table.$table.find('tbody tr').slice();
        for (var i = 0, l = tableRows.length; i < l; i += 1) {
            var $row = $(tableRows[i]);
            var rowIdentifier = $row.attr('data-identifier');
            if (table.store.identifiers[rowIdentifier].selected) {
                // $row.css('background-color', 'gray');
                setRowSelectCssClasses(table, $row, true);
            } else {
                // $row.css('background-color', '');
                setRowSelectCssClasses(table, $row, false);
            }
        }
    }

    function isSelected(table, $row) {
        return table.store.selectedRows.includes($row[0])
    }

    function RemoveFromArray(element, arr) {
        var index = arr.indexOf(element);
        arr.splice(index, 1);
    }

    function setIdentifierSelectStatus(table, identifier, selected) {
        var identifiers = table.store.identifiers;

        var element = identifiers.filter(function (element) {
            return element.identifier == identifier;
        })[0];

        element.selected = selected;
    }

    return selectable;
})();

module.exports = selectable;
},{}],8:[function(require,module,exports){
var sortable = (function () {
    'use strict';
    var dataLoader = require('../js/dataLoader.js');

    return {
        formatSortables: function (table) {
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

                dataLoader.loadData(table, 1);
            });
        },
    }
})();

module.exports = sortable;
},{"../js/dataLoader.js":3}],9:[function(require,module,exports){
var selectable = require('../js/selectable.js');

var renderer = {

    renderCell: function (table, colName, content) {
        if (table.settings && table.settings.columns && table.settings.columns[colName] && table.settings.columns[colName].render) {
            return table.settings.columns[colName].render(content);
        };

        return content;
    },

    renderRow: function (table, rowData) {
        var identifier = rowData[table.settings.features.identifier];
        var $row = $('<tr>');
        for (var col = 0; col < table._columnPropertyNames.length; col++) {
            var $col = $('<td>').html(renderer.renderCell(table, table._columnPropertyNames[col], rowData[table._columnPropertyNames[col]]));
            $row.append($col);
        }

        $row.attr('data-identifier', identifier);

        return $row;
    },

    renderNumberOfRows: function (table) {
        var numberOfRows = table.store.numberOfRows;

        var containers = table.$table.find('[number-of-rows]');

        for (var i = 0, l = containers.length; i < l; i += 1) {
            $(containers[i]).html(numberOfRows);
        }
    },

    renderNumberOfPages: function (table) {
        var numberOfPages = table.store.numberOfPages;

        var containers = table.$table.find('[number-of-pages]');

        for (var i = 0, l = containers.length; i < l; i += 1) {
            $(containers[i]).html(numberOfPages);
        }
    }
};

module.exports = renderer;
},{"../js/selectable.js":7}]},{},[1]);
