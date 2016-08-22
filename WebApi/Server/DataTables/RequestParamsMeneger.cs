namespace Server.filters
{
    using DataTables.Models.Filter;
    using DataTables.Models.Request;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Dynamic;
    using System.Web.Mvc;

    internal class RequestParamsMeneger
    {
        private ActionExecutedContext filterContext;

        public RequestParamsMeneger(ActionExecutedContext filterContext)
        {
            this.filterContext = filterContext;
        }

        public RequestModel GetRequestModel()
        {
            var pageSizeString = this.GetRequestParameter("pageSize", filterContext);
            var pageSize = int.Parse(pageSizeString);
            var pageString = this.GetRequestParameter("page", filterContext);
            var page = int.Parse(pageString);
            var filter = this.GetFilterDictionary(filterContext);
            var orderBy = this.GetRequestParameter("orderBy", filterContext);
            var ascString = this.GetRequestParameter("asc", filterContext);
            var asc = this.StringAsBool(ascString);
            var identifierPropName = this.GetRequestParameter("identifierPropName", filterContext);
            var getIdentifiersString = this.GetRequestParameter("getIdentifiers", filterContext);
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

            //var identifiers = data.Select(x => identifierPropInfo.GetValue(x));
            var identifiers = data.Select($"{identifierPropName}");

            return identifiers;
        }

        private string GetRequestParameter(string param, ActionExecutedContext filterContext)
        {
            var requestParam = filterContext.Controller.ValueProvider.GetValue(param);
            if (requestParam == null)
            {
                return null;
            }
            var requestedParamValue = requestParam.AttemptedValue;
            return requestedParamValue;
        }

        private Dictionary<string, FilterRequestModel> GetFilterDictionary(ActionExecutedContext filterContext)
        {
            var dictAsObject = filterContext.Controller.ValueProvider.GetValue("filter").AttemptedValue;
            var dictObj = JsonConvert.DeserializeObject<Dictionary<string, FilterRequestModel>>(dictAsObject);
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