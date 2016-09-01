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
            active: true,
            length: 5
        },

        features: {
            selectable: {
                active: true,
                cssCasses: 'active',
            }
        },

        colors: {
            // No colors yet
        }
    };

    var table = {
        init: function (selector, settings) {
            this._$table = $(selector).first();

            // Settings
            configureSettings(table, settings, defaultSettings);

            // Paginator settings
            configurePaginator(this, settings, defaultSettings);
            // Init table store
            configureStore(this);

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
        validator.ValidateValueCannotBeNullOrUndefined(settings, 'settings', 'The configuration object argument is missing from the datatable init() function constructor.');

        table._settings = {};
        configureSettingsAjax(table, settings, defaultSettings);
        configureSettingsFeatures(table, settings, defaultSettings);
        configureSettingsPaging(table, settings, defaultSettings);
        configureSettingsColumns(table, settings);
    }

    function configureSettingsPaging(table, settings, defaultSettings) {
        table._settings.paging = defaultSettings.paging;
        if (!settings.paging) return;

        table._settings.pageSize = settings.paging.pageSize || defaultSettings.pageSize;
    }

    function configureSettingsFeatures(table, settings) {
        table._settings.features = {};
        if (settings.features == null) return;

        table._settings.features.identifier = settings.features.identifier || null;
        table._settings.features.selectable = defaultSettings.features.selectable;
        if (settings.features.selectable) {
            table._settings.features.selectable.active = settings.features.selectable.active || defaultSettings.features.selectable.active;
            table._settings.features.selectable.cssClasses = settings.features.selectable.cssClasses || defaultSettings.features.selectable.cssClasses;
        }
    }

    function configureSettingsColumns(table, settings) {
        if (!settings.columns) return;
        table._settings.columns = settings.columns;
    }

    function configureSettingsAjax(table, settings, defaultSettings) {
        validator.ValidateValueCannotBeNullOrUndefined(settings.ajax, 'settings.ajax');
        validator.ValidateValueCannotBeNullOrUndefined(settings.ajax.url, 'settings.ajax.url');

        table._settings.ajax = {};
        table._settings.ajax.url = settings.ajax.url;
    }

    function configureStore(table) {
        table.store = {
            columnPropertyNames: getColumnPropertyNames(),
            filter: [],
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