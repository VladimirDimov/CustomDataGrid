namespace Server.filters
{
    using DataTables.CommonProviders;
    using DataTables.Models.Filter;
    using DataTables.Models.Request;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Dynamic;
    using System.Web.Mvc;

    internal class RequestParamsManager
    {
        private JsonProvider jsonProvider;

        public RequestParamsManager()
        {
            this.jsonProvider = new JsonProvider();
        }

        public RequestModel GetRequestModel(ActionExecutedContext filterContext)
        {
            var pageSizeString = this.GetRequestParameterOrDefault("pageSize", filterContext);
            var pageSize = int.Parse(pageSizeString);
            var pageString = this.GetRequestParameterOrDefault("page", filterContext);
            var page = int.Parse(pageString);
            var filter = this.GetFilterDictionary(filterContext);
            var orderBy = this.GetRequestParameterOrDefault("orderBy", filterContext);
            var ascString = this.GetRequestParameterOrDefault("asc", filterContext);
            var asc = this.StringAsBool(ascString);
            var identifierPropName = this.GetRequestParameterOrDefault("identifierPropName", filterContext);
            var getIdentifiersString = this.GetRequestParameterOrDefault("getIdentifiers", filterContext);
            var getIdentifiers = this.StringAsBool(getIdentifiersString);

            var data = (IOrderedQueryable<object>)filterContext.Controller.ViewData.Model;

            IQueryable identifiers = getIdentifiers ? this.GetIdentifiersCollection(identifierPropName, data) : null;

            var requestModel = new RequestModel
            {
                PageSize = pageSize,
                Page = page,
                Filter = filter,
                OrderByPropName = orderBy,
                IsAscending = asc,
                IdentifierPropName = identifierPropName,
                GetIdentifiers = getIdentifiers,
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

        private string GetRequestParameterOrDefault(string param, ActionExecutedContext filterContext)
        {
            var requestParam = filterContext.Controller.ValueProvider.GetValue(param);
            if (requestParam == null)
            {
                return null;
            }

            var requestedParamValue = requestParam.AttemptedValue;

            return requestedParamValue;
        }

        private string GetRequestParameter(string param, ActionExecutedContext filterContext)
        {
            var requestParam = filterContext.Controller.ValueProvider.GetValue(param);
            if (requestParam == null)
            {
                throw new ArgumentException($"The request parameter \"{param}\" is missing.");
            }

            var requestedParamValue = requestParam.AttemptedValue;

            return requestedParamValue;
        }

        private Dictionary<string, FilterRequestModel> GetFilterDictionary(ActionExecutedContext filterContext)
        {
            var dictAsObject = filterContext.Controller.ValueProvider.GetValue("filter").AttemptedValue;
            var dictObj = this.jsonProvider.Deserialize<Dictionary<string, FilterRequestModel>>(dictAsObject);
            var dict = dictObj as Dictionary<string, FilterRequestModel>;

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