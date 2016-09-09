var spinner = (function () {
    'use strict';

    var spinner = {
        init: function (table) {
            if (table.settings.spinner.enable === false) {
                return;
            }

            setSpinner(table);
            table.events.onDataLoading.push(renderSpinner);
        }
    };

    function setSpinner(table) {
        var width = 200;
        var spinnerStyle = table.settings.spinner.style;
        var $spinnerRow = $('<tr/>');
        // $spinnerRow.css('z-index', -5000);
        $spinnerRow.css('position', 'fixed');
        $spinnerRow.css('left', '40%');
        $spinnerRow.css('top', '30%');

        var $spinnerCell = $('<td/>');
        $spinnerCell.attr('colSpan', table.store.columnPropertyNames.length);
        $spinnerCell.css('text-align', 'center');

        var $image = $('<img/>');
        $image.attr('src', '/assets/datatableserverside/img/spinners/' + spinnerStyle + '.gif');
        $image.css('display', 'block');
        $image.css('margin', 'auto auto');
        $image.css('width', width + 'px');

        $spinnerCell.append($image);
        $spinnerRow.append($spinnerCell);
        table.settings.$spinner = $spinnerRow;
    }

    function renderSpinner(table) {
        var $tableBody = table.$table.find('tbody');
        // $tableBody.empty();
        $tableBody.append(table.settings.$spinner);
    }

    return spinner;
} ());

module.exports = spinner;