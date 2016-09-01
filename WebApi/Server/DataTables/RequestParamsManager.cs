namespace Server.filters
{
    using DataTables.CommonProviders;
    using DataTables.CommonProviders.Contracts;
    using DataTables.Models.Filter;
    using DataTables.Models.Request;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Dynamic;
    using System.Web.Mvc;

    public class RequestParamsManager
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
            var asc = this.StringAsBool(ascString);
            var identifierPropName = httpContextHelpers.GetRequestParameterOrDefault("identifierPropName", filterContext);
            var isGetIdentifiersString = httpContextHelpers.GetRequestParameter("getIdentifiers", filterContext);
            var isGetIdentifiers = this.StringAsBool(isGetIdentifiersString);

            var data = (IOrderedQueryable<object>)filterContext.Controller.ViewData.Model;

            IQueryable identifiers = isGetIdentifiers ? this.GetIdentifiersCollection(identifierPropName, data) : null;

            var requestModel = new RequestModel
            {
                PageSize = pageSize,
                Page = page,
                Filter = filter,
                OrderByPropName = orderBy,
                IsAscending = asc,
                IdentifierPropName = identifierPropName,
                GetIdentifiers = isGetIdentifiers,
                Data = data,
                Identifiers = identifiers,
            };

            return requestModel;
        }

        private IQueryable GetIdentifiersCollection(string identifierPropName, IQueryable<object> data)
        {
            if (string.IsNullOrEmpty(identifierPropName))
            {
                throw new ArgumentNullException("Identifiers property name must be provided");
            }

            if (data == null)
            {
                throw new ArgumentNullException("Invalid null data");
            }

            var collectionDataType = data.GetType().GetGenericArguments().FirstOrDefault();

            var identifierPropInfo = collectionDataType
                .GetProperty(identifierPropName);

            var identifiers = data.Select($"{identifierPropName}");

            return identifiers;
        }

        private IEnumerable<KeyValuePair<string, FilterRequestModel>> GetFilterDictionary(ActionExecutedContext filterContext)
        {
            var dictAsObject = filterContext.Controller.ValueProvider.GetValue("filter").AttemptedValue;
            var dictObj = this.jsonProvider.Deserialize<IEnumerable<KeyValuePair<string, FilterRequestModel>>>(dictAsObject);
            var dict = dictObj as IEnumerable<KeyValuePair<string, FilterRequestModel>>;

            return dict;
        }

        private bool StringAsBool(string val)
        {
            switch (val.ToLower())
            {
                case "true":
                    return true;

                case "false":
                    return false;

                default:
                    throw new ArgumentException($"Invalid bool value: {val}");
            }
        }
    }
}