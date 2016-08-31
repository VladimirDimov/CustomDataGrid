window.dataTable = function () {
    'use strict'

    var selectable = require('../js/selectable.js');
    var sortable = require('../js/sortable.js');
    var dataLoader = require('../js/dataLoader.js');
    var paginator = require('../js/paginator.js');
    var filter = require('../js/filter.js');
    var editable = require('../js/editable');
    var validator = require('../js/validator.js')

    var defaultSettings = {
        pageSize: 10,
        paginator: {
            length: 10
        },
        features: {
            enableFilter: true,
            selectable: {
                active: true,
                cssCasses: 'active',
                // cssCasses: 'dt-row-selected',
            }
        },
        colors: {
            // No colors yet
        }
    };

    var table = {
        init: function (selector, settings) {
            this._$table = $(selector).first();

            validateSettings(settings);

            // Paginator settings
            configurePaginator(this, settings, defaultSettings);
            // Init table store
            configureStore(this);
            // Settings
            configureSettings(table, settings, defaultSettings);

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

    function configureSettings(table, settings, defaultSettings) {
        validateSettings(settings);
        table._settings = {
            ajax: {
                url: settings.ajax.url
            },
            colors: {
            },
            pageSize: settings.pageSize || defaultSettings.pageSize,
            features: {
                identifier: settings.features.identifier,
                selectable: settings.features.selectable,
                editable: settings.features.editable
            },
            columns: settings.columns || {}
        };
    }

    function validateSettings(settings) {
        validator.ValidateValueCannotBeNullOrUndefined(settings, "settings", "The configuration object argument is missing from the datatable init constructor function.");
        validator.ValidateValueCannotBeNullOrUndefined(settings.ajax, "settings.ajax");
        validator.ValidateValueCannotBeNullOrUndefined(settings.ajax.url, "settings.ajax.url");
    }

    function configureStore(table) {
        table.store = {
            columnPropertyNames: getColumnPropertyNames(),
            filter: new Object(),
            selectedRows: [],
            identifiers: null,
            pageData: null,
            data: {}
        };
    }

    function configurePaginator(table, settings, defaultSettings) {
        table._paginator = {};
        table._paginator.currentPage = 1;
        table._paginator.length = settings.paginator ? settings.paginator.length : defaultSettings.paginator.length;
        table._paginator.$paginator = paginator(table).setPaginator(1, table._paginator.length, 1);
    }

    function processFeatures(features) {
        if (features.selectable.active && features.selectable.active == true) {
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
};

module.exports = dataTable;