var dataLoader = require('../../../js/dataLoader.js');

var filterInitialiser = (function (dataLoader) {
    'use strict';

    return {
        init: function (table) {
            table.store.filter = [];
            filterInitialiser.setFilterEvent(table);
        },
        setFilterEvent: function (table) {
            var $filter = $(table.$table[0]).find('[filter]');
            // var $filter = $(table.$table[0].querySelectorAll('[filter]'));
            $filter.on('change', function () {
                var $target = $(this);
                var dictKey = this;
                var filterOperator = $target.attr('filter');
                var availableKeyElement;
                var keyIndex = -1;

                for (var index in table.store.filter) {
                    keyIndex += 1;
                    if (table.store.filter[index].key === dictKey) {
                        availableKeyElement = true;
                        break;
                    }
                }

                var keyToAdd = {
                    key: dictKey,
                    value: {
                        key: $target.attr('data-columnNames'),
                        operator: filterOperator || 'ci',
                        value: $target.val(),
                    }
                };

                if (availableKeyElement) {
                    table.store.filter[keyIndex] = keyToAdd;
                } else {
                    table.store.filter.push(keyToAdd);
                }

                dataLoader.loadData(table, 1);
            });
        }
    };
} (dataLoader));

module.exports = filterInitialiser;