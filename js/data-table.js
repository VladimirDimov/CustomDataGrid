var features = require('../js/features.js');
var selectable = require('../js/selectable.js');
var sortable = require('../js/sortable.js');
var dataLoader = require('../js/dataLoader.js');
var paginator = require('../js/paginator.js');
var filter = require('../js/filter.js');
var editable = require('../js/editable');
var validator = require('../js/validator.js');
var settingsExternal = require('../js/dt-settings.js');

window.dataTable = (function (
    selectable,
    sortable,
    dataLoader,
    paginator,
    filter,
    editable,
    validator,
    settingsExternal,
    features) {
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

            filter.setFilterEvent(this);
            sortable.formatSortables(this);

            if (settings.features) {
                processFeatures(settings.features)
            };

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
            filter: [],
            selectedRows: [],
            identifiers: null,
            pageData: null,
            data: {},
            requestIdentifiersOnDataLoad: false,
        };
    }

    function configurePaginator(table, dataLoader) {
        if (!table.paginator) {
            table.paginator = {};
        }

        table._paginator.$paginator = paginator.init(table, 1, table.settings.paginator.length, 1);
        paginator.setPageClickEvents(table, dataLoader);
    }

    function processFeatures(features) {
        if (!features) return;
        if (features.selectable && features.selectable.active && features.selectable.active == true) {
            selectable.makeSelectable(table);
        };

        if (features.editable) {
            editable.init(table);
        }
    }

    function getColumnPropertyNames() {
        var colPropNames = [];
        var $columns = table.$table.find('thead tr:last-child').children();
        for (var i = 0; i < $columns.length; i++) {
            colPropNames.push($($columns[i]).attr('data-name'));
        }

        return colPropNames;
    };

    return table;
})(selectable, sortable, dataLoader, paginator, filter, editable, validator, settingsExternal, features);

module.exports = window.dataTable;