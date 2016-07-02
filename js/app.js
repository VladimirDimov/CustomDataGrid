// // Some code
var vDataTable = require('../js/v-data-table.js');

var tb = vDataTable().init('#table', {
  ajax: {
    url: 'http://localhost:65219/home/index'
  },
  columns: {
    Salary: {
      render: function (content) {
        return '**' + content + '$$$**';
      }
    },
    Actions: {
      render: function () {
        return '<button class="btn-edit">Edit</button>';
      }
    }
  },
  features: {
    selectable: {
      active: true,
      identifier: 'Id',
      selectFunction: function ($row) {
        return $row.children().first('td').html();
      }
    },
    // filter:  [names of the columns to be filtered]
    editable: {
      FirstName: {
        edit: function ($td) {
          var val = $td.html();
          var $input = $('<input>');
          $input.val(val);
          $td.html($input);
        },

        save: function ($td) {
          // TODO: Return {value: ..., render: 'html to render to'}
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
          // TODO: Return {value: ..., render: 'html to render to'}
        }
      }
    }
  }
});

$('table').on('click', function (e) {
  if (!$(e.target).hasClass('btn-edit')) return;
  var $row = $(e.target).parent().parent();
  var $cols = $row.find('td');

  tb.edit($row);
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