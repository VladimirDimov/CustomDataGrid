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