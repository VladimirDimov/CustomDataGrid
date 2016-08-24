namespace DataTables.ProcessDataProviders
{
    using Expressions;
    using System;
    using System.Linq;
    using System.Linq.Expressions;

    class SortProvider
    {
        internal IQueryable<object> SortCollection(IQueryable<object> filteredData, string orderBy, bool asc, Type collectionDataType)
        {
            if (!string.IsNullOrEmpty(orderBy))
            {
                var propType = collectionDataType.GetProperty(orderBy).PropertyType;
                var expr = OrderByLambda.LambdaExpression(collectionDataType, orderBy, propType, asc);
                IQueryable<object> sorted = (IQueryable<object>)expr.Compile().DynamicInvoke(filteredData);
                return sorted;
            }

            return filteredData;
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
