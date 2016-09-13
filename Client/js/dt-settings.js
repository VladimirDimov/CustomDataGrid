var defaultSettings = require('../js/dt-default-settings.js');
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
            setCustomPaginator.call(this, settings.paginator);
            setCustomFeatures.call(this, settings.features);
            setCustomColumns.call(this, settings.columns);
            setCustomEditable.call(this, settings.editable);

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

    function setCustomPaginator(paginator) {
        if (!paginator) return;
        if (paginator.length) {
            validator.ValidateShouldBeANumber(paginator.length, "settings.paginator.length");
            this.paginator.length = paginator.length;
        }
    }

    function setCustomFeatures(features) {
        if (!features) return;
        if (features.selectable) {
            if (features.selectable.enable != undefined) {
                validator.ValidateMustBeValidBoolean(features.selectable.enable, "features.selectable.enable");
                this.features.selectable.enable = features.selectable.enable;
            }

            if (features.selectable.cssClasses) {
                validator.ValidateMustBeValidStringOrNull(features.selectable.cssClasses, "features.selectable.cssClasses");
                this.features.selectable.cssClasses = features.selectable.cssClasses;
            }

            if (features.selectable.multi != undefined) {
                validator.ValidateMustBeValidBoolean(features.selectable.multi);
                this.features.selectable.multi = features.selectable.multi;
            }

            if (features.identifier) {
                validator.ValidateMustBeValidString(features.identifier, 'features.identifier');
                this.features.identifier = features.identifier;
            }
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