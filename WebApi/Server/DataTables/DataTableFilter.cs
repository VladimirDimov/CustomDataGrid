namespace Server.filters
{
    using Data;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Reflection;
    using System.Text;
    using System.Web.Mvc;
    using System.Linq.Dynamic;

    public class DataTableFilter : ActionFilterAttribute
    {
        private ActionResult result;

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
            var filter = this.GetRequestParameter("filter", filterContext);
            var orderBy = this.GetRequestParameter("orderBy", filterContext);
            var ascString = this.GetRequestParameter("asc", filterContext);
            var asc = this.StringAsBool(ascString);
            var identifierPropName = this.GetRequestParameter("identifierPropName", filterContext);
            var getIdentifiersString = this.GetRequestParameter("getIdentifiers", filterContext);
            var getIdentifiers = this.StringAsBool(getIdentifiersString);

            var data = (IQueryable<object>)filterContext.Controller.ViewData.Model;
            var collectionDataType = data.GetType().GetGenericArguments().FirstOrDefault();

            IQueryable identifiers = getIdentifiers ? this.GetIdentifiersCollection(identifierPropName, data) : null;

            // Set page
            IQueryable<object> filteredData = this.FilterData(data, filter);

            if (!string.IsNullOrEmpty(orderBy))
            {
                var prop = collectionDataType.GetProperty(orderBy);
                if (asc)
                {
                    //filteredData = filteredData.OrderBy(x => prop.GetValue(x));
                    filteredData = filteredData.OrderBy(orderBy);
                }
                else
                {
                    filteredData = filteredData.OrderBy(orderBy).Reverse();
                }
            }
            else
            {
                var identifierPropInfo = collectionDataType
                .GetProperty(identifierPropName);

                filteredData = filteredData
                    .OrderBy(identifierPropName);
            }

            var resultData = filteredData
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

        private IQueryable<object> FilterData(IQueryable<object> data, string filter)
        {
            if (string.IsNullOrEmpty(filter))
            {
                return data;
            }

            var filteredData = data
               .Where(x => this.ConcatPropertyValues(x).ToLower().Contains(filter.ToLower()));

            return filteredData;
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

        private string ConcatPropertyValues(object obj)
        {
            var propInfos = obj.GetType().GetProperties();
            var builder = new StringBuilder();
            foreach (var propInfo in propInfos)
            {
                builder.Append(propInfo.GetValue(obj));
            }

            return builder.ToString();
        }

        private string GetRequestParameter(string param, ActionExecutedContext filterContext)
        {
            var requestParams = filterContext.Controller.ValueProvider.GetValue(param).AttemptedValue;
            return requestParams;
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