namespace DataTables.ProcessDataProviders
{
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using System.Web.Mvc;
    using Contracts;
    using DataTables.CommonProviders;
    using DataTables.CommonProviders.Contracts;
    using DataTables.Models.Filter;
    using DataTables.Models.Request;

    /// <summary>
    /// Handles the passed params from the filter context
    /// </summary>
    internal class RequestParamsManager : IRequestParamsManager
    {
        private const string PageSize = "pageSize";
        private const string Page = "page";
        private const string OrderBy = "orderBy";
        private const string Asc = "asc";
        private const string IdentifierPropName = "identifierPropName";
        private const string GetIdentifiers = "getIdentifiers";

        private IJsonProvider jsonProvider;
        private IHttpContextHelpers httpContextHelpers;

        [ExcludeFromCodeCoverage]
        public RequestParamsManager()
        {
            this.jsonProvider = new JsonProvider();
            this.httpContextHelpers = new HttpContextHelpers();
        }

        public RequestParamsManager(IJsonProvider jsonProvider, IHttpContextHelpers httpContextHelpers)
        {
            this.jsonProvider = jsonProvider;
            this.httpContextHelpers = httpContextHelpers;
        }

        public RequestModel GetRequestModel(ActionExecutedContext filterContext)
        {
            var pageSizeString = httpContextHelpers.GetRequestParameter(PageSize, filterContext);
            var pageSize = int.Parse(pageSizeString);
            var pageString = httpContextHelpers.GetRequestParameter(Page, filterContext);
            var page = int.Parse(pageString);
            var filter = this.GetFilterDictionary(filterContext);
            var orderBy = httpContextHelpers.GetRequestParameterOrDefault(OrderBy, filterContext);
            var ascString = httpContextHelpers.GetRequestParameter(Asc, filterContext);
            var asc = bool.Parse(ascString);
            var identifierPropName = httpContextHelpers.GetRequestParameterOrDefault(IdentifierPropName, filterContext);
            var isGetIdentifiersString = httpContextHelpers.GetRequestParameter(GetIdentifiers, filterContext);
            var isGetIdentifiers = bool.Parse(isGetIdentifiersString);

            var data = (IOrderedQueryable<object>)filterContext.Controller.ViewData.Model;

            var requestModel = new RequestModel
            {
                PageSize = pageSize,
                Page = page,
                Filter = filter,
                OrderByPropName = orderBy,
                IsAscending = asc,
                IdentifierPropName = identifierPropName,
                GetIdentifiers = isGetIdentifiers,
                Data = data
            };

            return requestModel;
        }

        private IEnumerable<KeyValuePair<string, FilterRequestModel>> GetFilterDictionary(ActionExecutedContext filterContext)
        {
            var keyObj = filterContext.Controller.ValueProvider.GetValue("filter");
            if (keyObj == null)
            {
                return null;
            }

            var dictAsObject = keyObj.AttemptedValue;
            var dictObj = this.jsonProvider.Deserialize<IEnumerable<KeyValuePair<string, FilterRequestModel>>>(dictAsObject);
            var dict = dictObj as IEnumerable<KeyValuePair<string, FilterRequestModel>>;

            return dict;
        }
    }
}
