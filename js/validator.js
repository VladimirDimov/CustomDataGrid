var validator = (function () {
    var validator = {
        ValidateValueCannotBeNullOrUndefined(val, name, message) {
            if (val === null || val === undefined) {
                throw message || "Value cannot be null or undefined. Name: \"" + name + "\".";
            }
        }
    };

    return validator;
})();

module.exports = validator;