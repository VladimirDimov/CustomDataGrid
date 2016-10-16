var selectable = require('../js/Features/Selectable/selectable.js');

var renderer = (function (selectable) {
    'use strict';

    var renderer = {

        init: function (table) {
            setButtonEvents(table);
            setTemplates(table);
        },

        // Renders table cell. If there is a custom defined render function calls it first.
        renderCell: function (table, colName, content, rowData, renderFunctionName) {
            if (table.settings && table.settings.columns && table.settings.columns[colName] && table.settings.columns[colName].render) {
                var renderFuncObj = table.settings.columns[colName].render;
                if (typeof (renderFuncObj) === 'function') {
                    return table.settings.columns[colName].render(content, rowData);
                } else if (typeof (renderFuncObj) === 'object') {
                    if (typeof table.settings.columns[colName].render[renderFunctionName] !== 'function') {
                        throw 'Invalid render function: ' + renderFunctionName;
                    }

                    return table.settings.columns[colName].render[renderFunctionName](content, rowData);
                }
            };

            return content;
        },

        renderRow: function (table, rowData, templateName, index) {
            var identifierPropName = table.store.selectable ? table.store.selectable.identifier : null;
            var identifier = rowData[identifierPropName] || index;
            var $row;
            var propValue, $template;

            if (templateName != undefined && table.store.templates.main) {
                var $containers = table.store.templates[templateName].$containers;
                for (var i = 0, l = $containers.length; i < l; i += 1) {
                    var $container = $($containers[i]);
                    var propName = $container.attr('data-name');
                    var renderFunctionName = $container.attr('dt-render');
                    var propValue = rowData[propName];
                    var isNoCustomrRender = $container.attr('no-custom-render') !== undefined;
                    var cellData = isNoCustomrRender ? propValue : renderer.renderCell(table, propName, propValue, rowData, renderFunctionName);
                    var attributeValue = $container.attr('value');
                    if (typeof attributeValue === typeof undefined || attributeValue === false) {
                        $container.html(cellData);
                    } else {
                        $container.attr('value', cellData);
                    }
                }

                $row = table.store.templates[templateName].$template.clone();

                var $foreachContainers = $row.find('[dt-foreach]');
                for (var i = 0, l = $foreachContainers.length; i < l; i += 1) {
                    var $container = $($foreachContainers[i]);
                    var $foreachTemplate = $container.contents().clone();
                    $container.contents().empty();
                    var outerPropName = $container.attr('dt-foreach');
                    var propArr = rowData[outerPropName];

                    for (var j = 0, lj = propArr.length; j < lj; j += 1) {
                        var currentArrObject = propArr[j];
                        var $foreachTemplateToAdd = $foreachTemplate.clone();
                        var $foreachItemContainers = $foreachTemplateToAdd.find('[dt-foreach-item]');
                        for (var k = 0, lk = $foreachItemContainers.length; k < lk; k += 1) {
                            var $itemContainer = $($foreachItemContainers[i]);
                            var itemPropName = $itemContainer.attr('dt-foreach-item');
                            var attributeValue = $itemContainer.attr('value');
                            var itemValue = currentArrObject[itemPropName];
                            if (typeof attributeValue === typeof undefined || attributeValue === false) {
                                $itemContainer.html(itemValue);
                            } else {
                                $itemContainer.attr('value', itemValue);
                            }
                        }

                        $container.append($foreachTemplateToAdd);
                    }
                }

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
            var $tbody = table.$table.find('[dt-body], tbody').empty();
            var buffer = [];
            for (var row = 0; row < data.length; row++) {
                var rowData = data[row];
                var $row = renderer.renderRow(table, rowData, 'main', row);
                buffer.push($row);
            }

            $tbody.append(buffer);
        }
    };

    function setTemplates(table) {
        table.store.templates = {};
        var $templatesOrigin = table.$table.find('[dt-body] [dt-template], tbody [dt-template]');
        $templatesOrigin.remove();
        var $templates = $templatesOrigin.clone();
        if ($templates.length != 0) {
            Array.prototype.forEach.call($templates, function (el) {
                var $el = $(el);
                var template = {};
                template.$template = $el;
                template.$containers = $el.find('[data-name]');
                var $foreachContainers = $el.find('[dt-foreach]');
                template.foreachContainers = [];
                table.store.templates[$el.attr('dt-template')] = template;
                $el.removeAttr('dt-template');
            });
        }
    }

    function setButtonEvents(table) {
        table.$table.on('click', '[dt-btn-template]', function () {
            var $this = $(this);
            var $curRow = $this.parentsUntil('tr').parent();
            var identifier = $curRow.attr('data-identifier');
            var rowData = table.store.pageData[identifier];
            var $rowFromTemplate = renderer.renderRow(table, rowData, $(this).attr('dt-btn-template'));

            // fade in the new template
            var delay = $this.attr('dt-delay') || 0;
            $($curRow).fadeOut(0, 0);
            $curRow.html($rowFromTemplate.html());
            $($curRow).fadeIn(parseInt(delay));
        });
    }

    return renderer;
} (selectable));

module.exports = renderer;