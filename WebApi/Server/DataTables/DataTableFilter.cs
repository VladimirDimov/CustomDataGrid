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
    using System.Linq.Expressions;
    using DataTables.Models;
    using Newtonsoft.Json;

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
            var filter = this.GetFilterDictionary(filterContext);
            var orderBy = this.GetRequestParameter("orderBy", filterContext);
            var ascString = this.GetRequestParameter("asc", filterContext);
            var asc = this.StringAsBool(ascString);
            var identifierPropName = this.GetRequestParameter("identifierPropName", filterContext);
            var getIdentifiersString = this.GetRequestParameter("getIdentifiers", filterContext);
            var getIdentifiers = this.StringAsBool(getIdentifiersString);

            var data = (IQueryable<object>)filterContext.Controller.ViewData.Model;
            var collectionDataType = data.GetType().GetGenericArguments().FirstOrDefault();

            IQueryable identifiers = getIdentifiers ? this.GetIdentifiersCollection(identifierPropName, data) : null;

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
                    filteredData = filteredData.OrderBy($"{orderBy} descending");
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

        private IQueryable<object> FilterData(IQueryable<object> data, IDictionary<string, string> filterDict)
        {
            if (filterDict == null || filterDict.Keys.Count == 0)
            {
                return data;
            }

            var filterQueries = new List<string>();
            foreach (var filter in filterDict)
            {
                if (string.IsNullOrEmpty(filter.Value))
                {
                    continue;
                }

                var keyProps = filter.Key.Split(new char[] { ' ', ',' }, StringSplitOptions.RemoveEmptyEntries);
                var currentQueries = (keyProps.Select(x => $"{x}.Contains(\"{filter.Value}\")"));
                filterQueries.Add($"{string.Join(" or ", currentQueries)}");
            }

            var query = string.Join(" and ", filterQueries);
            if (string.IsNullOrEmpty(query))
            {
                return data;
            }

            var filteredData = data
                //.Where(x => this.ConcatPropertyValues(x).ToLower().Contains(filter.ToLower()));
                .Where(query);

            return filteredData;
        }

        //public static IQueryable<T> Like<T>(this IQueryable<T> source, string propertyName, string keyword)
        //{
        //    var type = typeof(T);
        //    var property = type.GetProperty(propertyName);
        //    string number = "Int";
        //    if (property.PropertyType.Name.StartsWith(number))
        //        return source;

        //    var parameter = Expression.Parameter(type, "p");
        //    var propertyAccess = Expression.MakeMemberAccess(parameter, property);
        //    var constant = Expression.Constant("%" + keyword + "%");
        //    MethodCallExpression methodExp = Expression.Call(null, typeof(SqlMethods).GetMethod("Like", new Type[] { typeof(string), typeof(string) }), propertyAccess, constant);
        //    Expression<Func<T, bool>> lambda = Expression.Lambda<Func<T, bool>>(methodExp, parameter);
        //    return source.Where(lambda);
        //}

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

        private string ConcatPropertyValues(Type type)
        {
            var propInfos = type.GetProperties();
            var propNames = new List<string>();
            foreach (var propInfo in propInfos)
            {
                propNames.Add(propInfo.Name);
            }

            return string.Join(", ", propNames);
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