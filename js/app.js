// // Some code
var vDataTable = require('../js/v-data-table.js');
// var $ = require('jquery');

var tb = vDataTable().init('#table', {
    ajax: {
        url: 'http://localhost:65219/home/index'
    },
    columns: {
      Salary: {
        render: function(content) {
          return '**' + content + '$$$**';
        }
      },
      Actions: {
          render: function() {
            return '<button>button</button>';
          }
      }
    },
    features: {
      // selectable: true
      selectable: function($row) {
        return $row.html();
      }
    }
});
