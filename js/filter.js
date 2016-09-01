var filter = (function () {
    'use strict';
    var dataLoader = require('../js/dataLoader.js');

    return {
        setFilterEvent: function (table) {
            var $filter = $(table.$table[0]).find('[filter]');
            $filter.on('change', function () {
                var $target = $(this);
                var dictKey = this;
                var filterOperator = $target.attr('filter');

                var keyIndex = -1;
                var availableKeyElement = table.store.filter.find(function (el) {
                    keyIndex += 1;
                    return el.key === dictKey;
                });

                var keyToAdd = {
                    key: dictKey,
                    value: {
                        key: $target.attr('data-props'),
                        operator: filterOperator || 'ci',
                        value: $target.val(),
                    }
                };

                if (availableKeyElement) {
                    table.store.filter[keyIndex] = keyToAdd;
                } else {
                    table.store.filter.push(keyToAdd);
                }

                dataLoader.loadData(table, 1, true);
            });
        }
    };
} ());

module.exports = filter;