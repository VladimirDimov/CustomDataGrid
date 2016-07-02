var selectable = require('../js/selectable.js');
var sortable = require('../js/sortable.js');
var dataLoader = require('../js/dataLoader.js');
var paginator = require('../js/paginator.js');
var filter = require('../js/filter.js');
var editable = require('../js/editable');

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
      var tb = {};
      this._$table = $(selector).first();
      this._$table._currentPage = 1;

      // Paginator settings
      this._paginator = {};
      this._paginator.length = (settings.paginator && settings.paginator.length) || defaultSettings.paginator.length;
      this._paginator.$paginator = paginator(this).setPaginator(1, this._paginator.length, 1);
      this._columnPropertyNames = setColumnPropertyNames();

      // Data
      this.store = {
        selectedRows: [],
        identifiers: null,
      };

      // Settings
      this._settings = {
        ajax: {
          url: settings.ajax.url
        },
        colors: {
          selectedRow: 'gray',
        },
        pageSize: settings.pageSize || defaultSettings.pageSize,
        features: {
          selectable: settings.features.selectable,
          editable: settings.features.editable
        },
        columns: settings.columns || {}
      }

      paginator(this).setPageClickEvents(this);
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
      var $filter = $(table.$table[0]).find('.filter');
      return $filter.val();
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
      colPropNames.push($($columns[i]).attr('data-colName'));
    }

    return colPropNames;
  };

  return table;
};

module.exports = vDataTable;