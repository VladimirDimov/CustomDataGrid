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
        return '<button class="btn-edit">Edit</button>' +
          '<button class="btn-save">Save</button>';
      }
    }
  },
  features: {
    identifier: 'Id',
    selectable: {
      active: true,
      selectFunction: function ($row) {
        return $row.children().first('td').html();
      }
    },
    // filter:  [names of the columns to be filtered]
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

$('table').on('click', function (e) {
  if (!$(e.target).hasClass('btn-edit')) return;
  var $row = $(e.target).parent().parent();

  tb.edit($row);
});

$('table').on('click', function (e) {
  if (!$(e.target).hasClass('btn-save')) return;
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