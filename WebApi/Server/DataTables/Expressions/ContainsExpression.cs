namespace DataTables.Expressions
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;

    class ContainsExpression
    {
        public LambdaExpression CreateLambda(string props, object filterValue, string filterOperator, Type genericType)
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

        private Expression GetPropertySelectExpression(string prop, object filterValue, Expression argumentExpr, string filterOperator)
        {
            switch (filterOperator)
            {
                case "cs":
                    return GetContainsPartialExpr(prop, filterValue, argumentExpr, isCaseInsensitive: false);

                case "ci":
                    return GetContainsPartialExpr(prop, filterValue, argumentExpr, isCaseInsensitive: true);

                default:
                    return CreateCompareLambda(prop, filterValue, argumentExpr, filterOperator);
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

        private static Expression CreateCompareLambda(string propName, object filter, Expression xExpr, string filterOperator)
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
            var propType = xExpr.Type.GetProperty(propName).PropertyType;

            object parsedFilter = null;
            if (propType.GetMethods().Any(m => m.Name == "Parse"))
            {
                parsedFilter = ParseFilter(filter, propType);
            }
            else
            {
                parsedFilter = filter;
            }

            var parsedFilterExpr = Expression.Constant(parsedFilter);
            // x => x.Prop.CompareTo(value)

            var compareToExpr = GetCompareToExpression(filterOperator, parsedFilterExpr, propExpr);
            // x => x.Prop.CompareTo(value) == 0
            //var operatorExpr = Expression.Equal(compareToExpr, Expression.Constant(0));

            return compareToExpr;
        }

        private static Expression GetCompareToExpression(string filterOperator, Expression left, Expression right)
        {
            switch (filterOperator)
            {
                case "=":
                    return Expression.Equal(left, right);

                case ">=":
                    return Expression.GreaterThanOrEqual(left, right);

                case "<=":
                    return Expression.LessThanOrEqual(left, right);

                case ">":
                    return Expression.GreaterThan(left, right);

                case "<":
                    return Expression.LessThan(left, right);

                default:
                    throw new ArgumentException($"Invalid comparisson operator {filterOperator}");
            }
        }

        private static object ParseFilter(object filter, Type toType)
        {
            var xExpr = Expression.Parameter(typeof(string), "x");
            var castedValExpr = Expression.Call(toType, "Parse", null, new Expression[] { xExpr });
            return Expression.Lambda(castedValExpr, new ParameterExpression[] { xExpr }).Compile().DynamicInvoke(filter);
        }

        private Expression GetContainsPartialExpr(string prop, object filter, Expression xExpr, bool isCaseInsensitive = false)
        {
            // x => ((Cast)x).Prop1.ToString().ToLower().Contains(filter1.ToLower()) || x.Prop2.ToString().ToLower().Contains(filter2.ToLower()) || ...;

            // filter
            var filterConstExpr = Expression.Constant(filter);
            // ToLower()
            var toLowerMethodInfo = typeof(string).GetMethod("ToLower", Type.EmptyTypes);
            // filter.ToLower()
            Expression filterToLowerExpr;
            if (isCaseInsensitive)
            {
                filterToLowerExpr = Expression.Call(filterConstExpr, toLowerMethodInfo);
            }
            else
            {
                filterToLowerExpr = filterConstExpr;
            }

            // x.Name
            var namePropExpr = Expression.Property(xExpr, prop);

            // Contains
            var containsMethodInfo = typeof(string).GetMethod("Contains", new Type[] { typeof(string) });
            // ToString()
            var toStringMethodInfo = typeof(object).GetMethod("ToString");
            // x.Name.ToString()
            var toStringExprCall = Expression.Call(namePropExpr, toStringMethodInfo);
            // x.Prop.ToString().ToLower()
            Expression toLowerExprCall;
            if (isCaseInsensitive)
            {
                toLowerExprCall = Expression.Call(toStringExprCall, toLowerMethodInfo);
            }
            else
            {
                toLowerExprCall = toStringExprCall;
            }

            // x.Prop.ToString().ToLower().Contains(filter.ToLower())
            var containsExprCall = Expression.Call(toLowerExprCall, containsMethodInfo, filterToLowerExpr);

            return containsExprCall;
        }
    }
}
