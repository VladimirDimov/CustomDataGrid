var dataLoader = require('../js/dataLoader.js');

var sortable = (function (dataLoader) {
    'use strict';
    return {
        formatSortables: function (table) {
            var $sortables = table.$table.find('th[sortable]');
            $sortables.find('.th-inner').addClass('sortable both');

            $sortables.on('click', function (e) {
                var $target = $(this);
                console.log($target);
                var name = $target.attr('data-name');
                var isAsc = (table.orderBy && table.orderBy.Name == name) ? !table.orderBy.Asc : true;
                table.orderBy = {
                    Name: name,
                    Asc: isAsc
                };

                dataLoader.loadData(table, 1)
                    .then(function () {
                        $sortables.removeAttr('asc desc');
                        if (isAsc) {
                            // $target.attr('asc', '');
                            $target.find('.th-inner').addClass('sortable both asc');
                            $target.find('.th-inner').removeClass('desc');
                        } else {
                            // $target.attr('desc', '');
                            $target.find('.th-inner').addClass('sortable both desc');
                            $target.find('.th-inner').removeClass('asc');
                        }
                    });
            });
        },
    }
})(dataLoader);

module.exports = sortable;