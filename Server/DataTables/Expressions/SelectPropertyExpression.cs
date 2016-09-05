namespace DataTables.Expressions
{
    using System;
    using System.Linq;
    using System.Linq.Expressions;

    public static class SelectPropertyExpression
    {
        public static LambdaExpression GetSelectPropertyExpr(Type propType, string propName)
        {
            // x
            var xExpr = Expression.Parameter(typeof(object), "x");
            // (Cast)x
            var xCastExpr = Expression.Convert(xExpr, propType);
            //(Cast)x.Property
            var propExpr = Expression.Property(xCastExpr, propName);
            // x => ((Cast)x).Property.ToString()
            var propToStringExpr = Expression.Call(propExpr, "ToString", null, null);
            var lambdaExpr = Expression.Lambda(propExpr, xExpr);

            return lambdaExpr;
        }

        public static IQueryable GetSelectCollection(Type collectionGenericType, string propName, IQueryable<object> collection)
        {
            var selectPropExpr = SelectPropertyExpression.GetSelectPropertyExpr(collectionGenericType, propName);

            var propInfo = collectionGenericType.GetProperty(propName);
            //var castedSelectPropExpr = Expression.Convert(selectPropExpr, typeof(Expression<>).MakeGenericType(typeof(Func<,>).MakeGenericType(new Type[] { collectionGenericType, propInfo.PropertyType })));
            var castedSelectPropExpr = selectPropExpr;
            var collectionExpr = Expression.Parameter(collection.GetType(), "collection");
            var castedCollectionExpr = Expression.Convert(collectionExpr, typeof(IQueryable<>).MakeGenericType(new Type[] { collectionGenericType }));
            // Queryble.Select(collection, x => (Cast)x.Prop)
            var selectCallExpr = Expression.Call(typeof(Queryable),
                "Select",
                new Type[] { typeof(object), propInfo.PropertyType },
                new Expression[] { collectionExpr, selectPropExpr });
            var selectCallLambda = Expression.Lambda(selectCallExpr, collectionExpr);

            var identifiers = selectCallLambda.Compile().DynamicInvoke(collection);

            return (IQueryable)identifiers;
        }
    }
}
