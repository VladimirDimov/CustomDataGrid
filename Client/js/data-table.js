var features = require('../js/features.js');
var selectable = require('../js/selectable.js');
var sortable = require('../js/sortable.js');
var dataLoader = require('../js/dataLoader.js');
var paginator = require('../js/paginator.js');
var filter = require('../js/filter.js');
var editable = require('../js/editable');
var validator = require('../js/validator.js');
var settingsExternal = require('../js/dt-settings.js');
var spinner = require('../js/spinners.js');
var renderer = require('../js/renderer.js');

window.dataTable = (function (
    selectable,
    sortable,
    dataLoader,
    paginator,
    filter,
    editable,
    validator,
    settingsExternal,
    features,
    renderer) {
    'use strict'

    var table = {
        init: function (selector, settings) {
            this._$table = $(selector).first();

            // Settings
            this._settings = settingsExternal.init(settings);
            // Init objects
            configureEvents(this);
            configureStore(this);

            configurePaginator(this, dataLoader);
            features.init(this);
            spinner.init(this);
            processFeatures(settings.features, this);
            renderer.init(this);

            dataLoader.loadData(table, 1, true);

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
    }

    function configureStore(table) {
        table.store = {
            columnPropertyNames: getColumnPropertyNames(),
            pageData: null,
            data: {},
            requestIdentifiersOnDataLoad: false,
        };
    }

    function configurePaginator(table, dataLoader) {
        if (table.settings != undefined && table.settings.paging != undefined && table.settings.paging.enable === false) {
            return;
        }

        if (!table.paginator) {
            table.paginator = {};
        }

        paginator.init(table, 1, table.settings.paginator.length, 1);
        paginator.setPageClickEvents(table, dataLoader);
    }

    function processFeatures(features, table) {
        if (features) {
            if (features.selectable) {
                selectable.makeSelectable(table);
            };
        }

        filter.init(table);
        sortable.formatSortables(table);
        editable.init(table);
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

    return table;
})(selectable, sortable, dataLoader, paginator, filter, editable, validator, settingsExternal, features, renderer);

module.exports = window.dataTable;