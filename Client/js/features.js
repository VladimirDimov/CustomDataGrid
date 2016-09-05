var dataLoader = require('../js/dataLoader.js');
var tableRenderer = require('../js/table-renderer.js');

var features = (function (dataLoader, tableRenderer) {
    'use strict';

    var features = {
        init: function (table) {
            table.events.onDataLoaded.push(renderNumberOfRows);
            table.events.onDataLoaded.push(renderNumberOfPages);
        },

        test: "123"
    };


    function renderNumberOfRows(table) {
        var numberOfRows = table.store.numberOfRows;

        var containers = table.$table.find('[number-of-rows]');

        for (var i = 0, l = containers.length; i < l; i += 1) {
            $(containers[i]).html(numberOfRows);
        }
    }

    function renderNumberOfPages(table) {
        var numberOfPages = table.store.numberOfPages;

        var containers = table.$table.find('[number-of-pages]');

        for (var i = 0, l = containers.length; i < l; i += 1) {
            $(containers[i]).html(numberOfPages);
        }
    }

    return features;
} (dataLoader, tableRenderer));

module.exports = features;