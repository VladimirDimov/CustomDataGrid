var paginatorPredefinedTemplatesFactory = (function () {
    'use strict'

    return {
        getTemplate: function (templateNumber, configurations) {
            switch (templateNumber) {
                case "1":
                    return getTemplateA(configurations);

                case "2":
                    return getTemplateB(configurations);

                default:
                    throw "Invalid paginator template number: " + templateNumber;
            }
        }
    };

    function getTemplateA(configurations) {
        var html = '<ul class="pagination pagination-sm">' +
            '<li dt-paginator-page><a href="#" dt-paginator-inner>1</a></li>' +
            '<li dt-paginator-page dt-active class="active"><a href="#" dt-paginator-inner>2</a></li>' +
            '<li dt-paginator-page><a href="#" dt-paginator-inner>3</a></li>' +
            '<li dt-paginator-page><a href="#" dt-paginator-inner>4</a></li>' +
            '<li dt-paginator-page><a href="#" dt-paginator-inner>5</a></li>' +
            '</ul>';

        return $.parseHTML(html);
    }

    function getTemplateB(configurations) {
        var html =
            '<ul class="pagination pagination-lg">' +
            '<li class="page-item" dt-paginator-prev>' +
            '<a class="page-link" href="#" aria-label="Previous">' +
            '<span aria-hidden="true">&laquo;</span>' +
            '<span class="sr-only">Previous</span>' +
            '</a>' +
            '</li>' +
            '<li class="page-item" dt-paginator-first>' +
            '<a class="page-link" href="#">first</a>' +
            '</li>' +
            '<li class="page-item" dt-paginator-page>' +
            '<a dt-paginator-inner class="page-link" href="#">1</a>' +
            '</li>' +
            '<li class="page-item active" dt-paginator-page dt-active>' +
            '<a dt-paginator-inner class="page-link" href="#">2</a>' +
            '</li>' +
            '<li class="page-item" dt-paginator-last>' +
            '<a class="page-link" href="#">last</a>' +
            '</li>' +
            '<li class="page-item" dt-paginator-next>' +
            '<a class="page-link" href="#" aria-label="Next">' +
            '<span aria-hidden="true">&raquo;</span>' +
            '<span class="sr-only">Next</span>' +
            '</a>' +
            '</li>' +
            '</ul>';

        return $.parseHTML(html);
    }

})();

module.exports = paginatorPredefinedTemplatesFactory;