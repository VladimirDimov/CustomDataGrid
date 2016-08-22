var filter = (function () {
    'use strict';
    var dataLoader = require('../js/dataLoader.js');

    return {
        setFilterEvent: function (table) {
            var $filter = $(table.$table[0]).find('[filter]');
            $filter.on('change', function () {
                var $target = $(this);
                var dictKey = $target.attr('data-props');
                var filterOperator = $target.attr('filter');
                var dictValue = $target.val();
                table.store.filter[dictKey] = { value: dictValue, operator: filterOperator || 'ci' };
                dataLoader.loadData(table, 1, true);
            });
        }
    };
} ());

module.exports = filter;