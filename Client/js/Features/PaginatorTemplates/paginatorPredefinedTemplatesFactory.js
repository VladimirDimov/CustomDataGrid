var paginatorPredefinedTemplatesFactory = (function () {
    'use strict'

    return {
        getTemplate: function (templateNumber, configurations) {
            switch (templateNumber) {
                case "1":
                    return getTemplateA(configurations);

                default:
                    break;
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

})();

module.exports = paginatorPredefinedTemplatesFactory;