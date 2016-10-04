var dataLoader = require('../../../js/dataLoader.js');

var sortable = (function (dataLoader) {
    'use strict';
    var _dtInner = 'dt-inner',
        _ascCssClasses = 'asc',
        _descCssClasses = 'desc',
        _dtName = 'dt-name';

    return {
        init: function (table, settings) {
            var $sortables = table.$table.find('th[sortable]');
            $sortables.find('[' + _dtInner + ']').addClass('sortable both');
            table.store.$sortables = $sortables;
            configureSettings(table, settings);
            configureEvents(table, $sortables);
        },
    };

    function configureSettings(table, settings) {
        table.settings.sortable = {
            enable: true,
            ascCssClasses: _ascCssClasses,
            descCssClasses: _descCssClasses,
        };

        if (!settings.sortable) return;
        if (settings.sortable.enable === false) table.settings.sortable.enable = false;

        table.settings.sortable.ascCssClasses = settings.sortable.ascCssClasses || table.settings.sortable.ascCssClasses;
        table.settings.sortable.descCssClasses = settings.sortable.descCssClasses || table.settings.sortable.descCssClasses;
    }

    function configureEvents(table, $sortables) {
        if (!table.settings.sortable.enable) return;

        $sortables.on('click', function (e) {
            var $target = $(this);
            var name = $target.attr(_dtName);
            var isAsc = (table.orderBy && table.orderBy.Name == name) ? !table.orderBy.Asc : true;
            table.orderBy = {
                Name: name,
                Asc: isAsc
            };

            dataLoader.loadData(table, 1, function () {
                var sortable = table.settings.sortable;
                table.store.$sortables.find('[' + _dtInner + ']').removeClass(sortable.ascCssClasses + ' ' + sortable.descCssClasses);

                var $dtInner = $target.find('[' + _dtInner + ']');
                if (isAsc) {
                    $dtInner.addClass(sortable.ascCssClasses);
                    $dtInner.removeClass(sortable.descCssClasses);
                } else {
                    $dtInner.addClass(sortable.descCssClasses);
                    $dtInner.removeClass(sortable.ascCssClasses);
                }
            })
        });
    }
})(dataLoader);

module.exports = sortable;