(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var tb1 = dataTable().init('#table');

var tb = dataTable().init('#table', {
    ajax: {
        url: 'http://localhost:65219/home/indexDB'
    },
    columns: {
        Salary: {
            render: function (content) {
                return content + ' $';
            }
        },

        Actions: {
            render: function () {
                return '<button class="btn-edit">Edit</button>' +
                    '<button class="btn-save">Save</button>';
            }
        },

        StartDate: {
            render: function (content) {
                var milli = content.replace(/\/Date\((-?\d+)\)\//, '$1');
                var d = new Date(parseInt(milli));
                var formattedDate = d.getUTCDate() + "." + d.getUTCMonth() + "." + d.getUTCFullYear();

                return formattedDate;
            }
        }
    },

    features: {
        identifier: 'Id',
        selectable: {
            active: true,
            cssClasses: 'active'
            // selectFunction: function ($row) {
            //   // return $row.children().first('td').html();
            // }
        },
        editable: {
            columns: {
                FirstName: {
                    edit: function ($td) {
                        var val = $td.html();
                        var $input = $('<input>');
                        $input.val(val);
                        $td.html($input);
                    },

                    save: function ($td) {
                        var val = $td.find('input').first().val();

                        return val;
                    }
                },
                LastName: {
                    edit: function ($td) {
                        var val = $td.html();
                        var $input = $('<input>');
                        $input.val(val);
                        $td.html($input);
                    },

                    save: function ($td) {
                        var val = $td.find('input').first().val();

                        return val;
                    }
                }
            },

            update: function (data) {
                console.log(data);
            }
        }
    }
});

$('table').on('click', '.btn-edit', function (e) {
    var $row = $(e.target).parent().parent();
    tb.edit($row);
});

$('table').on('click', '.btn-save', function (e) {
    var $row = $(e.target).parent().parent();
    tb.save($row)
});

$('#btnGetSelected').on('click', function () {
    var selectedIdentifiers = tb.getSelected();
    console.log(selectedIdentifiers);
});

$('#selectAll').on('click', function () {
    tb.selectAll();
});

$('#unselectAll').on('click', function () {
    tb.unselectAll();
});
},{}]},{},[1]);
