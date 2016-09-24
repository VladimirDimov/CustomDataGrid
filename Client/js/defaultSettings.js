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
            style: 0,
            width: '100px',
            opacity: 1,
        }
    };

    return defaultSettings;
})();

module.exports = defaultSettings;