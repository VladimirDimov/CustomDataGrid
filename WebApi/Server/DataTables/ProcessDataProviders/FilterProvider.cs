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
            foreach (var filter in filterDict)
            {
                if (string.IsNullOrEmpty(filter.Value.Value))
                {
                    continue;
                }

                var props = filter.Key.Split(new char[] { ' ', ',' }, StringSplitOptions.RemoveEmptyEntries);

                var expr = (Expression<Func<object, bool>>)FilterExpression.LambdaExpression(
                                                                                    filter.Key,
                                                                                    filter.Value.Value,
                                                                                    filter.Value.Operator,
                                                                                    type);

                data = data.Where(expr);
            }

            return data;
        }
    }
}
