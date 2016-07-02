using Server.Controllers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Server.filters
{
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

            PropertyInfo identifierPropInfo = null;
            if (getIdentifiers && !string.IsNullOrEmpty(identifierPropName))
            {
                identifierPropInfo = collectionDataType
                   .GetProperty(identifierPropName);
            }

            // Set page
            var filteredData = data
                .Where(x => filter == null ? true : this.ConcatProperties(x).ToLower().Contains(filter.ToLower()));

            if (!string.IsNullOrEmpty(orderBy))
            {
                var prop = collectionDataType.GetProperty(orderBy);
                if (asc)
                {
                    filteredData = filteredData.OrderBy(x => prop.GetValue(x));
                }
                else
                {
                    filteredData = filteredData.OrderByDescending(x => prop.GetValue(x));
                }
            }

            var resultData = filteredData
                .Skip((page - 1) * pageSize).Take(pageSize);
            var json = new JsonResult();
            json.JsonRequestBehavior = JsonRequestBehavior.AllowGet;
            json.Data = new
            {
                identifiers = getIdentifiers && identifierPropInfo != null ?
                                data.Select(x => identifierPropInfo.GetValue(x)) :
                                null,
                data = resultData,
                rowsNumber = filteredData.Count()
            };

            filterContext.Result = json;
        }

        private string ConcatProperties(object obj)
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