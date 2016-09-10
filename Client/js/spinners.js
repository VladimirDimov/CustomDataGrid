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
        var $spinnerRow = $('<div/>');
        table.$table.children('tbody').css('position', 'relative');

        $spinnerRow.css('z-index', 0);
        $spinnerRow.css('position', 'absolute');
        $spinnerRow.css('width', '100%');
        $spinnerRow.css('top', '40%');
        $spinnerRow.css('border-style', 'none');
        $spinnerRow.css('text-align', 'center');

        var $image = $('<img/>');
        $image.attr('src', '/assets/datatableserverside/img/spinners/' + spinnerStyle + '.gif');
        $image.css('width', width + 'px');
        $image.css('position', 'relative');
        $image.css('margin', 'auto');
        $image.css('z-index', 1000);

        $spinnerRow.append($image);
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