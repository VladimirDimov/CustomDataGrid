var dataLoader = require('../../../js/dataLoader.js');
var renderer = require('../../../js/renderer.js');

var features = (function (dataLoader, renderer) {
    'use strict';
    var _numberOfRows = 'number-of-rows';
    var _numberOfPages = 'number-of-pages';

    var features = {
        init: function (table) {
            table.events.onDataLoaded.push(renderNumberOfRows);
            table.events.onDataLoaded.push(renderNumberOfPages);
        }
    };


    function renderNumberOfRows(table) {
        var numberOfRows = table.store.numberOfRows;

        var containers = table.$table.find('[' + _numberOfRows + ']');

        for (var i = 0, l = containers.length; i < l; i += 1) {
            $(containers[i]).html(numberOfRows);
        }
    }

    function renderNumberOfPages(table) {
        var numberOfPages = table.store.numberOfPages;

        var containers = table.$table.find('[' + _numberOfPages + ']');

        for (var i = 0, l = containers.length; i < l; i += 1) {
            $(containers[i]).html(numberOfPages);
        }
    }

    return features;
} (dataLoader, renderer));

module.exports = features;