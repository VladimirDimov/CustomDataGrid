var validator = require('../../../js/validator.js');

var paginatorTemplate = (function () {
    // 'use strict'

    var paginatorTemplate = {
        init: function () {
            return this;
        },

        get paginatorLength() {
            return this._paginatorLength;
        },
        set paginatorLength(value) {
            validator.ValidateMustBeAPositiveNumber(value);
            this._paginatorLength = value;
        },

        get $template() {
            return this._$template;
        },
        set $template($value) {
            validator.ValidateMustBeAJqueryObject($value, "paginatorTemplate.$template");
            this._$template = $value;
        },

        get $commonPageTemplate() {
            return this._$commonPageTemplate;
        },
        set $commonPageTemplate($value) {
            validator.ValidateMustBeAJqueryObject($value, "paginatorTemplate.$commonPageTemplate");
            this._$commonPageTemplate = $value;
        },

        get $activePageTemplate() {
            return this._$activePageTemplate;
        },
        set $activePageTemplate($value) {
            validator.ValidateMustBeAJqueryObject($value, "paginatorTemplate.$activePageTemplate");
            this._$activePageTemplate = $value;
        }
    };

    return paginatorTemplate;
})();

module.exports = paginatorTemplate;