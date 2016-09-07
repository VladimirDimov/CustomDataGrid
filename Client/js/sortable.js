    var dataLoader = require('../js/dataLoader.js');

var sortable = (function (dataLoader) {
    'use strict';
    return {
        formatSortables: function (table) {
            var $sortables = table.$table.find('th[sortable]');

            $sortables.on('click', function (e) {
                var name = $(e.target).attr('data-name');
                var isAsc = (table.orderBy && table.orderBy.Name == name) ? !table.orderBy.Asc : true;
                table.orderBy = {
                    Name: name,
                    Asc: isAsc
                };

                dataLoader.loadData(table, 1)
                    .then(function () {
                        $sortables.removeAttr('asc desc');
                        if (isAsc) {
                            $(e.target).attr('asc', '')
                        } else {
                            $(e.target).attr('desc', '')
                        }
                    });
            });
        },
    }
})(dataLoader);

module.exports = sortable;