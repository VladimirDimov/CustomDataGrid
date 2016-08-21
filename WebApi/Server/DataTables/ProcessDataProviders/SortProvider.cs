namespace DataTables.ProcessDataProviders
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Reflection;
    using System.Text;
    using System.Threading.Tasks;

    class SortProvider
    {
        internal IQueryable<object> SortCollection(IQueryable<object> filteredData, string orderBy, bool asc, Type collectionDataType)
        {
            if (!string.IsNullOrEmpty(orderBy))
            {
                var propType = collectionDataType.GetProperty(orderBy).PropertyType;
                var expr = CreateOrderByLambda(collectionDataType, orderBy, propType, asc);
                IQueryable<object> sorted = (IQueryable<object>)expr.Compile().DynamicInvoke(filteredData);
                return sorted;
            }

            return filteredData;
        }

        private static LambdaExpression CreateOrderByLambda(Type collectionGenericType, string propName, Type propType, bool isAscending)
        {
            // x => ((Cast)x).Property
            var xParam = Expression.Parameter(typeof(object), "x");
            var xAsType = Expression.Convert(xParam, collectionGenericType);
            var bindExpr = Expression.Property(xAsType, propName);
            var outerCastToObject = Expression.Convert(bindExpr, propType);

            Expression selectPropLambdaExpr = Expression.Lambda(outerCastToObject, xParam);

            var dataParam = Expression.Parameter(typeof(IQueryable<>).MakeGenericType(typeof(object)), "data");
            var orderByCall = Expression.Call(typeof(Queryable), OrderByMethodName(isAscending), new Type[] { typeof(object), propType }, new Expression[] { dataParam, selectPropLambdaExpr });

            var orderByLambdaExpr = Expression.Lambda(orderByCall, dataParam);

            return orderByLambdaExpr;
        }

        private static string OrderByMethodName(bool isAscending)
        {
            if (isAscending)
            {
                return "OrderBy";
            }

            return "OrderByDescending";
        }
    }
}
