namespace Server.filters
{
    using DataTables.Expressions;
    using DataTables.ProcessDataProviders;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Linq.Dynamic;
    using System.Linq.Expressions;
    using System.Web.Mvc;

    public class DataTableFilter : ActionFilterAttribute
    {
        private ActionResult result;
        private FilterProvider filterProvider;
        private SortProvider sortProvider;

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

            var collectionDataType = data.GetType().GetGenericArguments().FirstOrDefault();

            IQueryable identifiers = getIdentifiers ? this.GetIdentifiersCollection(identifierPropName, data) : null;

            IQueryable<object> filteredData = this.filterProvider.FilterDataWithExpressions(collectionDataType, data, filter);
            IQueryable<object> orderedData = this.sortProvider.SortCollection(filteredData, orderBy, asc, collectionDataType);

            var resultData = orderedData
                .Skip((page - 1) * pageSize).Take(pageSize);

            var json = new JsonResult();
            json.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
            json.Data = new
            {
                identifiers = identifiers,
                data = resultData,
                rowsNumber = filteredData.Count()
            };

            filterContext.Result = json;
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
            var requestParams = filterContext.Controller.ValueProvider.GetValue(param).AttemptedValue;
            return requestParams;
        }

        private Dictionary<string, string> GetFilterDictionary(ActionExecutedContext filterContext)
        {
            var dictAsObject = filterContext.Controller.ValueProvider.GetValue("filter").AttemptedValue;
            var dictObj = JsonConvert.DeserializeObject<Dictionary<string, string>>(dictAsObject);
            var dict = dictObj as Dictionary<string, string>;
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