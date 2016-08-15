namespace DataTables.ProcessDataProviders
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Text;
    using System.Threading.Tasks;

    class SortProvider
    {
        internal IQueryable<object> SortCollection(IQueryable<object> filteredData, string orderBy, bool asc, Type collectionDataType)
        {
            if (!string.IsNullOrEmpty(orderBy))
            {
                var prop = collectionDataType.GetProperty(orderBy);
                var expr = (Expression<Func<object, string>>)CreateSelectPropertyLambda(collectionDataType, prop.Name, prop.PropertyType);

                if (asc)
                {
                    filteredData = filteredData.OrderBy(expr);
                }
                else
                {
                    filteredData = filteredData.OrderByDescending(expr);
                }
            }

            return filteredData;
        }

        private static LambdaExpression CreateSelectPropertyLambda(Type type, string prop, Type propType)
        {
            // x => ((Cast)x).Property
            //x
            var xParam = Expression.Parameter(typeof(object), "x");
            // (Cast)x
            var xAsType = Expression.Convert(xParam, type);

            // (Cast)x.Prop
            var propExpr = Expression.Property(xAsType, prop);
            var outerCastToObject = Expression.Convert(propExpr, propType);

            var lambdaExpr = Expression.Lambda(propExpr, xParam);

            return lambdaExpr;
        }

    }
}
