namespace DataTables.ProcessDataProviders
{
    using Expressions;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Text;
    using System.Threading.Tasks;

    class FilterProvider
    {
        public IQueryable<object> FilterDataWithExpressions(Type type, IQueryable<object> data, IDictionary<string, string> filterDict)
        {
            var exprCreator = new ContainsExpression();

            foreach (var filter in filterDict)
            {
                if (string.IsNullOrEmpty(filter.Value))
                {
                    continue;
                }

                var props = filter.Key.Split(new char[] { ' ', ',' }, StringSplitOptions.RemoveEmptyEntries);

                foreach (var prop in props)
                {
                    var expr = (Expression<Func<object, bool>>)exprCreator.CreateLambda(filter.Key, filter.Value, type);
                    data = data.Where(expr);
                }
            }

            return data;
        }

    }
}
