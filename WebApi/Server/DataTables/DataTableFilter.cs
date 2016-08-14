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

            var data = (IOrderedQueryable<object>)filterContext.Controller.ViewData.Model;
            var collectionDataType = data.GetType().GetGenericArguments().FirstOrDefault();

            IQueryable identifiers = getIdentifiers ? this.GetIdentifiersCollection(identifierPropName, data) : null;

            IQueryable<object> filteredData = this.FilterDataWithExpressions(collectionDataType, data, filter);

            if (!string.IsNullOrEmpty(orderBy))
            {
                var prop = collectionDataType.GetProperty(orderBy);
                if (asc)
                {
                    //filteredData = filteredData.OrderBy(orderBy);
                    filteredData = filteredData.OrderBy((Expression<Func<object, string>>)CreateSelectPropertyLambda(collectionDataType, prop.Name, prop.PropertyType));
                }
                else
                {
                    //filteredData = filteredData.OrderBy($"{orderBy} descending");
                    filteredData = filteredData.OrderByDescending((Expression<Func<object, string>>)CreateSelectPropertyLambda(collectionDataType, prop.Name, prop.PropertyType));
                }
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

        private IQueryable<object> FilterDataWithExpressions(Type type, IQueryable<object> data, IDictionary<string, string> filterDict)
        {
            foreach (var filter in filterDict)
            {
                var props = filter.Key.Split(new char[] { ' ', ',' }, StringSplitOptions.RemoveEmptyEntries);

                foreach (var prop in props)
                {
                    var expr = (Expression<Func<object, bool>>)CreateFilterLambda(type, prop, filter.Value);
                    data = data.Where(expr);
                }
            }

            return data;
        }

        private static LambdaExpression CreateSelectPropertyLambda(Type type, string prop, Type propType)
        {
            // x => (CastToObject)((Cast)x).Property
            var xParam = Expression.Parameter(typeof(object), "x");
            var xAsType = Expression.Convert(xParam, type);
            var bindExpr = Expression.Property(xAsType, prop);
            var outerCastToObject = Expression.Convert(bindExpr, propType);

            var lambdaExpr = Expression.Lambda(outerCastToObject, xParam);

            return lambdaExpr;
        }

        private static LambdaExpression CreateFilterLambda(Type type, string prop, string filter)
        {
            // x => x.Name.Contains(filter);

            // filter
            var filterConstExpr = Expression.Constant(filter);

            // x
            var xParamExpr = Expression.Parameter(typeof(object), "x");

            // (<--Cast to original type-->)(x)
            var xCastToType = Expression.Convert(xParamExpr, type);

            // x.Name
            var namePropExpr = Expression.Property(xCastToType, prop);

            // Contains
            var containsMethodExpr = typeof(string).GetMethod("Contains", new Type[] { typeof(string) });

            // x.Name.Contains("...")
            var exprCall = Expression.Call(namePropExpr, containsMethodExpr, filterConstExpr);

            var lambda = Expression.Lambda<Func<object, bool>>(exprCall, xParamExpr);

            return lambda;
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