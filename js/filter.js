var filter = (function () {
    'use strict';
    var dataLoader = require('../js/dataLoader.js');

    return {
        setFilterEvent: function (table) {
            var $filter = $(table.$table[0]).find('.filter');
            $filter.on('change', function () {
                dataLoader.loadData(table, 1, true);
            });
        }
    };
} ());

module.exports = filter;