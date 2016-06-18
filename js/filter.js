var dataLoader = require('../js/dataLoader.js');

var filter = (function () {
    'use strict';

    return {
        setFilterEvent: function (table) {
            var $filter = $(table.$table[0]).find('.filter');
            $filter.on('change', function () {
                dataLoader(table).loadData(1, true);
            });
        }
    };
} ());

module.exports = filter;