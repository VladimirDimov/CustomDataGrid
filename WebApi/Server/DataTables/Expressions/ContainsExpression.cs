namespace DataTables.Expressions
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;

    class ContainsExpression
    {
        public LambdaExpression CreateLambda(string props, object filterValue, int filterOperator, Type genericType)
        {
            var propsCollection = props.Split(new char[] { ' ', ',' });
            var numberOfProps = propsCollection.Length;
            List<Expression> partialExpressions = new List<Expression>();
            // x
            var xParamExpr = Expression.Parameter(typeof(object), "x");
            var xCastToGenericType = Expression.Convert(xParamExpr, genericType);

            for (int i = 0; i < numberOfProps; i++)
            {
                var expr = GetPropertySelectExpression(propsCollection[i], filterValue, xCastToGenericType, filterOperator);
                partialExpressions.Add(expr);
            }

            var orExpr = JoinWithOr(partialExpressions);
            var lambda = Expression.Lambda(orExpr, xParamExpr);

            return lambda;
        }

        private Expression GetPropertySelectExpression(string prop, object filterValue, Expression argumentExpr, int filterOperator)
        {
            switch (filterOperator)
            {
                case 0:
                    return GetContainsPartialExpr(prop, filterValue, argumentExpr);

                case 1:
                    return CreateCompareLambda(prop, filterValue, argumentExpr);

                default:
                    throw new ArgumentException();
            }
        }

        private Expression JoinWithOr(IList<Expression> expressions)
        {
            var numberOfExpressions = expressions.Count();

            if (numberOfExpressions == 1)
            {
                return expressions[0];
            }

            var orExpr = Expression.Or(expressions[0], expressions[numberOfExpressions - 1]);
            expressions[0] = orExpr;


            return JoinWithOr(expressions.Take(numberOfExpressions - 1).ToList());
        }

        private static Expression CreateCompareLambda(string propName, object filter, Expression xExpr)
        {
            //var genericType = collection.GetType().GenericTypeArguments.First();
            //var propType = collectionGenericType.GetProperty(propName).PropertyType;
            // x => x.Property.Compare(value)
            // =========================================
            // x => x
            //var xCastedExpr = Expression.Convert(xExpr, collectionGenericType);

            // x => x.Prop
            var propExpr = Expression.Property(xExpr, propName);
            // Value
            var parsedFilter = ParseFilter(filter, xExpr.Type.GetProperty(propName).PropertyType);
            var parsedFilterExpr = Expression.Constant(parsedFilter);
            // x => x.Prop.CompareTo(value)

            var compareToExpr = Expression.GreaterThanOrEqual(parsedFilterExpr, propExpr);
            // x => x.Prop.CompareTo(value) == 0
            //var operatorExpr = Expression.Equal(compareToExpr, Expression.Constant(0));

            return compareToExpr;
        }

        private static object ParseFilter(object filter, Type toType)
        {
            var xExpr = Expression.Parameter(typeof(string), "x");
            var castedValExpr = Expression.Call(toType, "Parse", null, new Expression[] { xExpr });
            return Expression.Lambda(castedValExpr, new ParameterExpression[] { xExpr }).Compile().DynamicInvoke(filter);
        }

        private Expression GetContainsPartialExpr(string prop, object filter, Expression xExpr)
        {
            // x => ((Cast)x).Prop1.ToString().ToLower().Contains(filter1.ToLower()) || x.Prop2.ToString().ToLower().Contains(filter2.ToLower()) || ...;

            // filter
            var filterConstExpr = Expression.Constant(filter);
            // ToLower()
            var toLowerMethodInfo = typeof(string).GetMethod("ToLower", System.Type.EmptyTypes);
            // filter.ToLower()
            var filterToLowerExpr = Expression.Call(filterConstExpr, toLowerMethodInfo);

            // x.Name
            var namePropExpr = Expression.Property(xExpr, prop);

            // Contains
            var containsMethodInfo = typeof(string).GetMethod("Contains", new Type[] { typeof(string) });
            // ToString()
            var toStringMethodInfo = typeof(object).GetMethod("ToString");
            // x.Name.ToString()
            var toStringExprCall = Expression.Call(namePropExpr, toStringMethodInfo);
            // x.Prop.ToString().ToLower()
            var toLowerExprCall = Expression.Call(toStringExprCall, toLowerMethodInfo);
            // x.Prop.ToString().ToLower().Contains(filter.ToLower())
            var containsExprCall = Expression.Call(toLowerExprCall, containsMethodInfo, filterToLowerExpr);

            return containsExprCall;
        }
    }
}
