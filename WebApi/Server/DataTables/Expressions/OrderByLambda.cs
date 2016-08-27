namespace DataTables.Expressions
{
    using System;
    using System.Linq;
    using System.Linq.Expressions;

    public static class OrderByLambda
    {
        public static LambdaExpression LambdaExpression(Type collectionGenericType, string propName, bool isAscending)
        {
            if (collectionGenericType == null)
            {
                throw new ArgumentNullException("Collection generic type cannot be null.");
            }

            if (string.IsNullOrEmpty(propName))
            {
                throw new ArgumentException("OrderBy property name cannot be null or empty.");
            }

            // x => ((Cast)x).Property
            var xParam = Expression.Parameter(typeof(object), "x");
            var xAsType = Expression.Convert(xParam, collectionGenericType);
            var bindExpr = Expression.Property(xAsType, propName);

            var propType = collectionGenericType.GetProperty(propName).PropertyType;
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
