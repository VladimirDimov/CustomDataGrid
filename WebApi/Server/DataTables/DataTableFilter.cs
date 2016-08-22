namespace Server.filters
{
    using DataTables.ProcessDataProviders;
    using System.Data.Entity;
    using System.Linq;
    using System.Linq.Dynamic;
    using System.Web.Mvc;

    public class DataTableFilter : ActionFilterAttribute
    {
        private ActionResult result;
        private FilterProvider filterProvider;
        private SortProvider sortProvider;
        private RequestParamsMeneger requestParamsManager;

        public DataTableFilter()
        {
            this.filterProvider = new FilterProvider();
            this.sortProvider = new SortProvider();
        }

        public override void OnResultExecuting(ResultExecutingContext filterContext)
        {
            this.result = filterContext.Result;
        }

        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            this.requestParamsManager = new RequestParamsMeneger(filterContext);
            var requestModel = this.requestParamsManager.GetRequestModel();

            var collectionDataType = requestModel.Data.GetType().GetGenericArguments().FirstOrDefault();

            IQueryable<object> filteredData = this.filterProvider.FilterDataWithExpressions(collectionDataType, requestModel.Data, requestModel.Filter);
            IQueryable<object> orderedData = this.sortProvider.SortCollection(filteredData, requestModel.OrderByPropName, requestModel.IsAscending, collectionDataType);

            var resultData = orderedData
                .Skip((requestModel.Page - 1) * requestModel.PageSize).Take(requestModel.PageSize);

            var json = new JsonResult();
            json.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
            json.Data = new
            {
                identifiers = requestModel.Identifiers,
                data = resultData,
                rowsNumber = filteredData.Count()
            };

            filterContext.Result = json;
        }
    }
}