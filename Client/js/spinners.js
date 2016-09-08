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
        var spinnerStyle = table.settings.spinner.style;
        var $spinnerRow = $('<tr/>');

        var $spinnerCell = $('<td/>');
        $spinnerCell.attr('colSpan', table.store.columnPropertyNames.length);
        $spinnerCell.css('text-align', 'center');

        var $image = $('<img/>');
        $image.attr('src', '/assets/datatableserverside/img/spinners/' + spinnerStyle + '.gif');
        $image.css('display', 'block');
        $image.css('margin', 'auto auto');

        $spinnerCell.append($image);
        $spinnerRow.append($spinnerCell);
        table.settings.$spinner = $spinnerRow;
    }

    function renderSpinner(table) {
        var $tableBody = table.$table.find('tbody');
        $tableBody.empty();
        $tableBody.append(table.settings.$spinner);
    }

    return spinner;
} ());

module.exports = spinner;