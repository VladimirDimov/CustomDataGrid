var dt = {
    _$table: "${}",

    _settings: {
        ajax: {
            url: ""
        },
        colors: {
            selectedRow: "",
        },
        pageSize: "",
        features: {
            identifier: "",
            selectable: "",
            editable: ""
        },
        columns: {}
    },

    _paginator: {
        length: 10,
        $paginator: "${}"
    },

    _columnPropertyNames,

    store: {
        filter: new Object(), // Dictionary with the filters
        selectedRows: [],
        identifiers: null,
        pageData: null,
        numberOfRows: 155,
        numberOfPages: 16
    },

    paginator: {
        start: 1,
        end: 10,
        currentPage: 5
    }
}