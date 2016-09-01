namespace DataTables.ProcessDataProviders
{
    using CommonProviders;
    using Expressions;
    using Models.Filter;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;

    public class FilterProvider
    {
        private ValidationProvider validationProvider;

        public FilterProvider()
        {
            this.validationProvider = new ValidationProvider();
        }

        public IQueryable<object> FilterData(
                                            Type dataCollectionGenericType,
                                            IQueryable<object> data,
                                            IEnumerable<KeyValuePair<string, FilterRequestModel>> filterDict)
        {
            // STARRT validation
            this.validationProvider.ValidateMustNotBeNull(dataCollectionGenericType, "data collection generic type");
            this.validationProvider.ValidateMustNotBeNull(data, "filtered data");
            this.validationProvider.ValidateMustNotBeNull(filterDict, "filters dictionary");
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
