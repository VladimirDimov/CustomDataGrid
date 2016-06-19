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
        return '<button>button</button>';
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
    }
  }
});

$('#btnGetSelected').on('click', function () {
  tb.getSelected();
});