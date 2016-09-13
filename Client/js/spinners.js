var defaultSettings = require('../js/dt-default-settings');

var spinner = (function (defaultSettings) {
    'use strict';

    var spinner = {
        init: function (table, settings) {
            if (settings.spinner && settings.spinner.enable === false) {
                return;
            }

            configureSettings(table, settings);

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

    function configureSettings(table, settings) {
        table.settings.spinner = defaultSettings.spinner;
        if (!settings.spinner) return;

        if (settings.spinner.enable != undefined && settings.spinner.enable === false) {
            table.settings.spinner.enable = false;
        }

        if (settings.spinner.style != undefined) {
            table.settings.spinner.style = settings.spinner.style;
        }
    }

    return spinner;
} (defaultSettings));

module.exports = spinner;