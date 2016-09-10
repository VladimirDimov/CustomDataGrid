namespace DataTables
{
    using CommonProviders;
    using ProcessDataProviders;
    using System;
    using System.Linq;
    using System.Web.Mvc;

    /// <summary>
    /// Application Engine
    /// </summary>
    class Engine
    {
        private FilterProvider filterProvider;
        private GetIdentifiersProvider getIdentifiersProvider;
        private JsonProvider jsonProvider;
        private RequestParamsManager requestParamsManager;
        private SortProvider sortProvider;

        public Engine()
        {
            this.filterProvider = new FilterProvider();
            this.sortProvider = new SortProvider();
            this.jsonProvider = new JsonProvider();
            this.requestParamsManager = new RequestParamsManager();
            this.getIdentifiersProvider = new GetIdentifiersProvider();
        }

        /// <summary>
        /// Catch passed parameters and apply all providers on the IQueryable collection
        /// </summary>
        /// <param name="filterContext"></param>
        public void Run(ActionExecutedContext filterContext)
        {
            // Get request model
            var requestModel = this.requestParamsManager.GetRequestModel(filterContext);

            var collectionDataType = requestModel.Data
                                        .GetType()
                                        .GetGenericArguments()
                                        .FirstOrDefault();
            // Filtered Data
            IQueryable<object> filteredData =
                                                requestModel.Filter == null ?
                                                requestModel.Data :
                                                this.filterProvider.FilterData(collectionDataType, requestModel.Data, requestModel.Filter);

            // Ordered Data
            IQueryable<object> orderedData = this.sortProvider.SortCollection(filteredData, requestModel.OrderByPropName, requestModel.IsAscending, collectionDataType);

            // Paged Data
            var pageData = orderedData
                .Skip((requestModel.Page - 1) * requestModel.PageSize)
                .Take(requestModel.PageSize);

            // Identifiers collection
            IQueryable identifiers = null;
            if (requestModel.GetIdentifiers)
            {
                identifiers = this.getIdentifiersProvider.GetIdentifierCollection(collectionDataType, requestModel.IdentifierPropName, orderedData);
            }

            // Set JSON Result
            var resultObj = new
            {
                identifiers = identifiers,
                data = pageData,
                rowsNumber = filteredData.Count()
            };
            var jsonResult = jsonProvider.GetJsonResult(resultObj);

            filterContext.Result = jsonResult;
        }
    }
}
