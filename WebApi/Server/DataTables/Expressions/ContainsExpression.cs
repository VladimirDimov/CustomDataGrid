namespace DataTables.Expressions
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;

    class ContainsExpression
    {
        public LambdaExpression CreateLambda(string props, string filter, Type genericType)
        {
            var propsCollection = props.Split(new char[] { ' ', ',' });
            var numberOfProps = propsCollection.Length;
            List<Expression> partialExpressions = new List<Expression>();
            // x
            var xParamExpr = Expression.Parameter(typeof(object), "x");
            var xCastToGenericType = Expression.Convert(xParamExpr, genericType);

            for (int i = 0; i < numberOfProps; i++)
            {
                var expr = GetFilterPartialExpr(propsCollection[i], filter, xCastToGenericType);
                partialExpressions.Add(expr);
            }

            var orExpr = JoinWithOr(partialExpressions);

            var lambda = Expression.Lambda(orExpr, xParamExpr);

            return lambda;
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

        private Expression GetFilterPartialExpr(string prop, string filter, Expression xExpr)
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
