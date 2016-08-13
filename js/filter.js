var filter = (function () {
    'use strict';
    var dataLoader = require('../js/dataLoader.js');

    return {
        setFilterEvent: function (table) {
            var $filter = $(table.$table[0]).find('.filter');
            $filter.on('change', function () {
                var $target = $(this);
                var dictKey = $target.attr('data-props');
                var dictValue = $target.val();
                table.store.filter[dictKey] = dictValue;
                dataLoader.loadData(table, 1, true);
            });
        }
    };
} ());

module.exports = filter;