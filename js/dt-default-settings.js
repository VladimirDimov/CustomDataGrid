var defaultSettings = (function () {
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
    };

    return defaultSettings;
})();

module.exports = defaultSettings;