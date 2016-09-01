var validator = (function () {
    var validator = {
        ValidateValueCannotBeNullOrUndefined(val, name, message) {
            if (val === null || val === undefined) {
                throw message || "Value cannot be null or undefined. Parameter name: \"" + name + "\".";
            }
        },

        ValidateShouldBeANumber(val, name, message) {
            if (!typeof (val) === 'number') {
                throw message || 'The value of ' + name + ' must be a number';
            }
        },

        ValidateMustBeAPositiveNumber(val, name, message) {
            this.ValidateShouldBeANumber(val);
            if (val < 0) {
                throw message || 'The value of ' + name + ' must be a positive number';
            }
        },

        ValidateMustBeValidBoolean(val, name, message) {
            this.ValidateValueCannotBeNullOrUndefined(val);
            if (typeof (val) !== 'boolean') {
                throw message || 'The value of ' + name + ' must be a valid boolean.';
            }
        },

        ValidateMustBeValidStringOrNull(val, name, message) {
            if (!val) return;
            if (typeof (val) !== 'string') {
                throw message || 'The value of ' + name + ' must be a valid string';
            }
        },

        ValidateMustBeValidString(val, name, message) {
            this.ValidateValueCannotBeNullOrUndefined(val, name, message);
            this.ValidateMustBeValidStringOrNull(val, name, message);
        },

        ValidateMustBeAFunction(val, name, message) {
            if (typeof (val) !== 'function') {
                throw message || 'The type of ' + name + ' must be a function.';
            }
        }
    };

    return validator;
})();

module.exports = validator;