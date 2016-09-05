namespace DataTables
{
    using CommonProviders;
    using ProcessDataProviders;
    using System;
    using System.Linq;
    using System.Web.Mvc;

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

        public void Run(ActionExecutedContext filterContext)
        {
            var requestModel = this.requestParamsManager.GetRequestModel(filterContext);
            var collectionDataType = requestModel.Data
                                        .GetType()
                                        .GetGenericArguments()
                                        .FirstOrDefault();

            IQueryable<object> filteredData = this.filterProvider.FilterData(collectionDataType, requestModel.Data, requestModel.Filter);

            IQueryable<object> orderedData = this.sortProvider.SortCollection(filteredData, requestModel.OrderByPropName, requestModel.IsAscending, collectionDataType);

            var resultData = orderedData
                .Skip((requestModel.Page - 1) * requestModel.PageSize)
                .Take(requestModel.PageSize);

            IQueryable identifiers = null;
            if (requestModel.GetIdentifiers)
            {
                identifiers = this.getIdentifiersProvider.GetIdentifierCollection(collectionDataType, requestModel.IdentifierPropName, orderedData);
            }

            filterContext.Result = jsonProvider
                .GetJsonResult(
                    new
                    {
                        identifiers = identifiers,
                        data = resultData,
                        rowsNumber = filteredData.Count()
                    });
        }
    }
}
