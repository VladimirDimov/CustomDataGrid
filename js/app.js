// Some code
var tb = vDataTable().init('#table', {
    ajax: {
        url: 'http://localhost:65219/home/index'
    },
    columns: {
      Salary: {
        render: function(content) {
          return '**' + content + '**';
        }
      }
    },
    features: {
      selectable: true
    }
});
