var sortable = (function () {
    'use strict';
    var dataLoader = require('../js/dataLoader.js');

    return {
        formatSortables: function (table) {
            var $sortables = table.$table.find('thead tr:last-child th[sortable]');

            $sortables.on('click', function (e) {
                var name = $(e.target).attr('data-name');
                var isAsc = (table.orderBy && table.orderBy.Name == name) ? !table.orderBy.Asc : true;
                table.orderBy = {
                    Name: name,
                    Asc: isAsc
                };

                $sortables.removeAttr('asc desc');
                if (isAsc) {
                    $(e.target).attr('asc', '')
                } else {
                    $(e.target).attr('desc', '')
                }

                dataLoader.loadData(table, 1);
            });
        },
    }
})();

module.exports = sortable;