namespace DataTables.ProcessDataProviders
{
    using CommonProviders;
    using Expressions;
    using System;
    using System.Linq;
    using System.Linq.Expressions;

    public class SortProvider
    {
        private ValidationProvider validationProvider;

        public SortProvider()
        {
            this.validationProvider = new ValidationProvider();
        }

        public IQueryable<object> SortCollection(IQueryable<object> filteredData, string orderBy, bool asc, Type collectionDataType)
        {
            if (!string.IsNullOrEmpty(orderBy))
            {
                this.validationProvider.ValidateMustNotBeNull(filteredData, "data collection");
                this.validationProvider.ValidateMustNotBeNull(collectionDataType, "data collection generic type");


                var expr = OrderByLambda.LambdaExpression(collectionDataType, orderBy, asc);
                IQueryable<object> sorted = (IQueryable<object>)expr.Compile().DynamicInvoke(filteredData);
                return sorted;
            }

            return filteredData;
        }
    }
}
