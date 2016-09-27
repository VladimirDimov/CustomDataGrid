namespace DataTables.ProcessDataProviders
{
    using System;
    using System.Linq;
    using System.Linq.Expressions;
    using CommonProviders;
    using Contracts;
    using Expressions;
    using Models.Request;

    public class FilterProvider : IProcessData
    {
        private ValidationProvider validationProvider;

        public FilterProvider()
        {
            this.validationProvider = new ValidationProvider();
        }

        public IQueryable<object> Execute(IQueryable<object> data, RequestModel requestModel, Type dataCollectionGenericType)
        {
            var filterDict = requestModel.Filter;
            if (filterDict == null)
            {
                return data;
            }

            // STARRT validation
            this.validationProvider.ValidateMustNotBeNull(dataCollectionGenericType, "data collection generic type");
            this.validationProvider.ValidateMustNotBeNull(data, "filtered data");
            // END validation

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
                                                                                    dataCollectionGenericType);

                data = data.Where(expr);
            }

            return data;
        }
    }
}
