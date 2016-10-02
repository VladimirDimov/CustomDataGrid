var defaultSettings = require('../../../js/defaultSettings');

// =====================================================================
// Example Configuration:
// =====================================================================
//       spinner: {
//          enable: true, // default value is "true"
//          style: 2,
//          opacity: 0.2,
//          width: '200px'
//       }
// =====================================================================
var spinnerInitialiser = (function (defaultSettings) {
    'use strict';

    var spinnerInitialiser = {
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
        var width = table.settings.spinner.width;
        var opacity = table.settings.spinner.opacity;
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
        $image.css('width', width);
        $image.css('position', 'relative');
        $image.css('margin', 'auto');
        $image.css('z-index', 1000);
        $image.css('opacity', opacity);

        $spinnerRow.append($image);
        table.settings.$spinner = $spinnerRow;
    }

    function renderSpinner(table) {
        var $tableBody = table.$table.find('tbody');
        // $tableBody.empty();
        $tableBody.append($('<tr/>'));
        $tableBody.append(table.settings.$spinner);
    }

    function configureSettings(table, settings) {
        table.settings.spinner = defaultSettings.spinner;
        if (!settings.spinner) return;
        table.settings.spinner.enable = settings.spinner.enable || defaultSettings.spinner.enable;
        table.settings.spinner.style = settings.spinner.style || defaultSettings.spinner.style;
        table.settings.spinner.width = settings.spinner.width || defaultSettings.spinner.width;
        table.settings.spinner.opacity = settings.spinner.opacity || defaultSettings.spinner.opacity;
    }

    return spinnerInitialiser;
} (defaultSettings));

module.exports = spinnerInitialiser;