namespace DataTables.ProcessDataProviders
{
    using System.Collections.Generic;
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
    public class RequestParamsManager : IRequestParamsManager
    {
        private JsonProvider jsonProvider;
        private IHttpContextHelpers httpContextHelpers;

        public RequestParamsManager()
        {
            this.jsonProvider = new JsonProvider();
            this.httpContextHelpers = new HttpContextHelpers();
        }

        public RequestModel GetRequestModel(ActionExecutedContext filterContext)
        {
            var pageSizeString = httpContextHelpers.GetRequestParameter("pageSize", filterContext);
            var pageSize = int.Parse(pageSizeString);
            var pageString = httpContextHelpers.GetRequestParameter("page", filterContext);
            var page = int.Parse(pageString);
            var filter = this.GetFilterDictionary(filterContext);
            var orderBy = httpContextHelpers.GetRequestParameterOrDefault("orderBy", filterContext);
            var ascString = httpContextHelpers.GetRequestParameter("asc", filterContext);
            var asc = bool.Parse(ascString);
            var identifierPropName = httpContextHelpers.GetRequestParameterOrDefault("identifierPropName", filterContext);
            var isGetIdentifiersString = httpContextHelpers.GetRequestParameter("getIdentifiers", filterContext);
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
