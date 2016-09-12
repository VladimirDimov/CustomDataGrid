var selectable = require('../js/selectable.js');

var renderer = (function (selectable) {
    'use strict';

    var renderer = {

        init: function (table) {
            setButtonEvents(table);
            var $templateMain = table.$table.find('table[dt-table] tr[dt-template-main]');
            var $templates = table.$table.find('table[dt-table] tr[dt-template]'); Array.prototype.forEach
            if ($templates.length != 0) {
                Array.prototype.forEach.call($templates, function (el) {
                    var $el = $(el);
                    var template = {};
                    template.$template = $el;
                    template.$containers = $el.find('[data-name]');
                    table.store.templates[$el.attr('dt-template')] = template;
                });
            }
        },

        renderCell: function (table, colName, content, rowData) {
            if (table.settings && table.settings.columns && table.settings.columns[colName] && table.settings.columns[colName].render) {
                return table.settings.columns[colName].render(content, rowData);
            };

            return content;
        },

        renderRow: function (table, rowData, templateName) {
            var identifier = rowData[table.settings.features.identifier];
            var $row;
            var propValue, $template;

            if (templateName != undefined) {
                var $containers = table.store.templates[templateName].$containers;
                for (var i = 0, l = $containers.length; i < l; i += 1) {
                    var $container = $($containers[i]);
                    var propName = $container.attr('data-name');
                    var propValue = rowData[propName];
                    var cellData = renderer.renderCell(table, propName, propValue, rowData);
                    var attributeValue = $container.attr('value');
                    if (typeof attributeValue === typeof undefined || attributeValue === false) {
                        $container.html(cellData);
                    } else {
                        $container.attr('value', cellData);
                    }
                }

                $row = table.store.templates[templateName].$template.clone();
            } else {
                // If there is no main template provided the renderer will render the cells directly into the td elements
                $row = $('<tr>');
                for (var col = 0, l = table.store.columnPropertyNames.length; col < l; col++) {
                    var propName = table.store.columnPropertyNames[col];

                    if (!propName) {
                        throw 'Missing column name. Each <th> in the data table htm element must have an attribute "data-name"'
                    }

                    propValue = rowData[propName];

                    var $col = $('<td>').html(renderer.renderCell(table, propName, propValue, rowData));
                    $row.append($col);
                }
            }

            $row.attr('data-identifier', identifier);

            return $row;
        },

        RenderTableBody: function (table, data) {
            var $tbody = table.$table.find('tbody').empty();
            var buffer = [];
            for (var row = 0; row < data.length; row++) {
                var rowData = data[row];
                var $row = renderer.renderRow(table, rowData, 'main');
                buffer.push($row);
            }

            $tbody.append(buffer);
        }
    };

    function setButtonEvents(table) {
        table.$table.on('click', '[dt-btn-template]', function () {
            var $curRow = $(this).parentsUntil('tr').parent();
            var identifier = $curRow.attr('data-identifier');
            var rowData = table.store.pageData[identifier];
            var $rowFromTemplate = renderer.renderRow(table, rowData, $(this).attr('dt-btn-template'));
            $curRow.html($rowFromTemplate.html());
        })
    }

    return renderer;
} (selectable));

module.exports = renderer;