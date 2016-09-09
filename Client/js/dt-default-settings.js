var defaultSettings = (function () {
    var defaultSettings = {
        pageSize: 10,

        paginator: {
            length: 5
        },

        features: {
            selectable: {
                enable: false,
                multi: false,
                cssClasses: 'active',
            }
        },

        spinner: {
            enable: true,
            style: 0
        }
    };

    return defaultSettings;
})();

module.exports = defaultSettings;