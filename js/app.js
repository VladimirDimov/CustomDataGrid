var tb = $('#table').dataTable({
    // "ajax": "./data/data.json"
    // "processing": true,
    "serverSide": true,
    "ajax": {
        "url": "http://localhost:65219/home/index",
        "contentType": "application/json",
        "type": "POST",
        "data": function (d) {
            return JSON.stringify(d);
        }
    }
});