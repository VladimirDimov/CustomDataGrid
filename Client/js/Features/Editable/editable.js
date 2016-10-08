var renderer = require('../../../js/renderer.js');
var validator = require('../../../js/validator.js');

var editable = (function () {

    'use strict';
    var editable = {
        init: function (table, settings) {
            setOnClickEvents(table);
            configureSettings(table, settings);
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
        },

        updateRow: function (table, $row, templateName, functionName) {
            debugger;

            var $inputs = $row.find('[data-name]'),
                postData = {},
                identifier = $row.attr('data-identifier') || $row.parentsUntil('[data-identifier]').parent().attr('data-identifier'),
                postFunc;

            Array.prototype.forEach.call($inputs, function (el) {
                var $el = $(el);
                var curColName = $el.attr('data-name');
                postData[curColName] = $el.prop('value') || $el.html();
            });

            if (typeof table.settings.editable.update === 'function') {
                postFunc = table.settings.editable.update;
            } else if (typeof table.settings.editable.update === 'object') {
                postFunc = table.settings.editable.update[functionName];
            } else {
                throw 'Invalid post function typeof ' + typeof table.settings.editable.update;
            }

            var rowData = table.store.pageData[identifier];
            postFunc(
                postData,
                rowData,
                // SUCCESS
                function (postData) {
                    for (var prop in postData) {
                        if (rowData[prop] === undefined) {
                            continue;
                        }

                        rowData[prop] = postData[prop];
                    }

                    var $updatedRow = renderer.renderRow(table, rowData, templateName || 'main');

                    var identifierAttr = $row.attr('data-identifier');
                    if (identifierAttr === undefined || identifierAttr === false) {
                        $row = $row.parentsUntil('[data-identifier]').parent();
                    }

                    $row.html($updatedRow.html());

                    return postData;
                },
                // ERROR
                function () {
                    // Igonore error.
                });
        }
    };

    function configureSettings(table, settings) {
        if (!settings.editable) return;
        table.settings.editable = Object.create(Object.prototype);
        table.settings.editable.update = settings.editable.update;
    }

    function setOnClickEvents(table) {
        table.$table.on('click', '[dt-btn-edit]', function (e) {
            var $row = $(this).parentsUntil('tr').parent();
            editable.renderEditRow(table, $row);
        });

        table.$table.on('click', '[dt-btn-post]', function (e) {
            var $row = $(this).parentsUntil('tr, [dt-form]').parent();
            var updateArgs = $(this).attr('dt-btn-post').split(' ');
            var redirectToTemplate = updateArgs[0];
            var functionName = updateArgs[1];
            editable.updateRow(table, $row, redirectToTemplate, functionName, true);
        });
    }

    return editable;
} ());

module.exports = editable;