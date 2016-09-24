var dataLoader = require('../../../js/dataLoader.js');

var sortable = (function (dataLoader) {
    'use strict';
    return {
        init: function (table) {
            var $sortables = table.$table.find('th[sortable]');
            $sortables.find('.th-inner').addClass('sortable both');
            table.store.$sortables = $sortables;
            $sortables.on('click', function (e) {
                var $target = $(this);
                var name = $target.attr('data-name');
                var isAsc = (table.orderBy && table.orderBy.Name == name) ? !table.orderBy.Asc : true;
                table.orderBy = {
                    Name: name,
                    Asc: isAsc
                };

                dataLoader.loadData(table, 1)
                    .then(function () {
                        // table.store.$sortables.removeAttr('asc desc');
                        table.store.$sortables.find('.th-inner').removeClass('asc desc');

                        if (isAsc) {
                            $target.find('.th-inner').addClass('sortable both asc');
                            $target.find('.th-inner').removeClass('desc');
                        } else {
                            $target.find('.th-inner').addClass('sortable both desc');
                            $target.find('.th-inner').removeClass('asc');
                        }
                    });
            });
        },
    }
})(dataLoader);

module.exports = sortable;