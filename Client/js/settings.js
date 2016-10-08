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
        this.editable = Object.create(Object.prototype);
        this.editable.update = editable.update;
    }

    return settings;
})(defaultSettings, validator);

module.exports = settings;