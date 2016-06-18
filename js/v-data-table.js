var $ = require('jquery');
var selectable = require('../js/selectable.js');

vDataTable = function () {
  'use strict'

  var defaultSettings = {
    pageSize: 5,
    paginator: {
      length: 5
    },
    features: {
      enableFilter: true,
      selectable: true
    }
  };

  var table = {
    init: function (selector, settings) {
      this._$table = $(selector).first();
      this._$table._currentPage = 1;
      this._settings = settings;

      // Paginator settings
      this._paginator = {};
      this._settings.pageSize = settings.pageSize || defaultSettings.pageSize;
      this._paginator.length = (settings.paginator && settings.paginator.length) || defaultSettings.paginator.length;
      this._paginator.$paginator = setPaginator(1, this._paginator.length, 1);
      this._columnPropertyNames = setColumnPropertyNames();

      // Data
      this.data = {
        selectedRows: [],
      };

      setPageClickEvents();
      setFilterEvent();
      formatSortables();
      loadData(1);

      if (settings.features) {
        processFeatures(settings.features);
      };
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
      var $filter = $(table.$table[0]).find('.filter');
      return $filter.val();
    }
  };

  function processFeatures(features) {
    if (features.selectable) {
      selectable.makeSelectable(table);
    };
  }

  // function makeSelectable() {
  //   var $tbody = table.$table.find('tbody');
  //   $tbody.on('click', function (e) {
  //     $row = $(e.target).parentsUntil('tbody');

  //     if (!e.ctrlKey) {
  //       $tbody.find('tr').css('background-color', 'white');
  //     }

  //     $row.css('background-color', 'gray');
  //   });
  // }

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

      loadData(1);
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

  function loadData(page, isUpdatePaginator) {
    updatePaginator = updatePaginator || true;

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
        refreshPageData(data.data);
        if (isUpdatePaginator) {
          updatePaginator(page, Math.ceil(data.rowsNumber / table.paginator.length));
        }
      }
    });
  };

  function updatePaginator(page, numberOfPages) {
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

    table.paginator.$paginator = setPaginator(start, end, page);
    setPageClickEvents();
  };

  function setPageClickEvents() {
    table.paginator.$paginator.on('click', 'li>a', function (e) {
      var page = $(e.target).html();
      table.paginator.$paginator.children('li').removeClass('active');
      $(e.target).parent().addClass('active');

      loadData(page, page == table.paginator.start || page == table.paginator.end);
    });
  };

  function setPaginatorActivePage(page) {

  };

  function setFilterEvent() {
    var $filter = $(table.$table[0]).find('.filter');
    $filter.on('change', function () {
      loadData(1, true);
    });
  }

  function setPaginator(start, end, activePage) {
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
  };

  function refreshPageData(data) {
    table.data = data;
    var $tbody = table.$table.children('tbody').empty();
    // TODO: To foreach the table._columnPropertyNames instead of the response data columns
    for (var row = 0; row < data.length; row++) {
      var element = data[row];
      var $row = $('<tr>');

      for (var col = 0; col < table._columnPropertyNames.length; col++) {
        var $col = $('<td>').html(render(table._columnPropertyNames[col], element[table._columnPropertyNames[col]]));
        $row.append($col);
      }

      $tbody.append($row);
    }
  };

  function render(colName, content) {
    if (table.settings && table.settings.columns && table.settings.columns[colName] && table.settings.columns[colName].render) {
      return table.settings.columns[colName].render(content);
    };

    return content;
  };

  return table;
};

module.exports = vDataTable;