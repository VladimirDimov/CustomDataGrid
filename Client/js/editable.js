var editable = (function () {
    var renderer = require('../js/renderer.js');

    'use strict';
    var editable = {
        init: function (table) {
            // // Init objects
            // table.store.templates = {};

            // var $template = table.$table.find('[dt-template-editable]');
            // table.store.templates.$editable = $template;
            // $template.remove();
            setOnClickEvents(table);
            // debugger;
        },

        // Replaces the content of a row with the edit template
        renderEditRow: function (table, $row) {
            $row.html(table.store.templates.editable.$template.html());
            // Fill inputs with the current values
            var $inputs = $row.find('.td-inner');
            var identifier = $row.attr('data-identifier');
            var rowData = table.store.pageData[identifier];
            Array.prototype.forEach.call($inputs, function (el) {
                var $el = $(el);
                $el.attr('value', rowData[$el.attr('data-name')]);
            }, this);

            var $allRows = table.$table.find('tr');
            Array.prototype.forEach.call($allRows, function (el) {
                // var $el = $(el);
                // if ($el.attr('data-identifier') != $row.attr('data-identifier')) {
                //     $el.css('visibility', 'hidden');
                // }
            }, this);
        },

        updateRow: function (table, $row) {
            var $inputs = $row.find('[data-name]');
            var postData = {};
            var identifier = $row.attr('data-identifier');
            Array.prototype.forEach.call($inputs, function (el) {
                var $el = $(el);
                var curColName = $el.attr('data-name');
                postData[curColName] = $el.prop('value') || $el.html();
            });

            var rowData = table.store.pageData[identifier];
            table.settings.editable.update(
                postData,
                // SUCCESS
                function () {
                    for (var prop in postData) {
                        rowData[prop] = postData[prop];
                    }
                },
                // ERROR
                function () {
                    // Nothing to do if error.
                });
            var $updatedRow = renderer.renderRow(table, rowData, $row.attr('dt-btn-upload') || 'main');
            $row.html($updatedRow.html());

            return postData;
        }
    };

    function setOnClickEvents(table) {
        table.$table.on('click', '[dt-btn-edit]', function (e) {
            var $row = $(this).parentsUntil('tr').parent();
            editable.renderEditRow(table, $row);
        });

        table.$table.on('click', '[dt-btn-update]', function (e) {
            var $row = $(this).parentsUntil('tr').parent();
            editable.updateRow(table, $row);
        });
    }

    return editable;
} ());

module.exports = editable;