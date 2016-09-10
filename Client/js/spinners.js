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
        table.$table.children('tbody').css('position', 'relative');

        $spinnerRow.css('z-index', 1000);
        $spinnerRow.css('position', 'absolute');
        $spinnerRow.css('width', '100%');
        $spinnerRow.css('top', '40%');

        var $spinnerCell = $('<td/>');
        $spinnerCell.attr('colSpan', table.store.columnPropertyNames.length);
        $spinnerCell.css('display', 'block');
        $spinnerCell.css('width', '100%');
        $spinnerCell.css('text-align', 'center');

        var $image = $('<img/>');
        $image.attr('src', '/assets/datatableserverside/img/spinners/' + spinnerStyle + '.gif');
        $image.css('width', width + 'px');
        $image.css('position', 'relative');
        $image.css('margin', 'auto');

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