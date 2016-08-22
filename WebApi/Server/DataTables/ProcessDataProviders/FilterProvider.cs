namespace DataTables.ProcessDataProviders
{
    using Expressions;
    using Models.Filter;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;

    class FilterProvider
    {
        public IQueryable<object> FilterDataWithExpressions(
                                                            Type type,
                                                            IQueryable<object> data,
                                                            IDictionary<string,
                                                            FilterRequestModel> filterDict)
        {
            var exprCreator = new ContainsExpression();

            foreach (var filter in filterDict)
            {
                if (string.IsNullOrEmpty(filter.Value.Value))
                {
                    continue;
                }

                var props = filter.Key.Split(new char[] { ' ', ',' }, StringSplitOptions.RemoveEmptyEntries);

                foreach (var prop in props)
                {
                    var expr = (Expression<Func<object, bool>>)exprCreator.CreateLambda(
                                                                                        filter.Key,
                                                                                        filter.Value.Value,
                                                                                        filter.Value.Operator,
                                                                                        type);

                    data = data.Where(expr);
                }
            }

            return data;
        }
    }
}
