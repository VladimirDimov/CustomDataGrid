namespace DataTables.ProcessDataProviders
{
    using System;
    using System.Linq;
    using CommonProviders;
    using Contracts;
    using Expressions;
    using Models.Request;

    public class SortProvider : IProcessData
    {
        private ValidationProvider validationProvider;

        public SortProvider()
        {
            this.validationProvider = new ValidationProvider();
        }

        public IQueryable<object> Execute(IQueryable<object> data, RequestModel requestModel, Type collectionDataType)
        {
            var orderBy = requestModel.OrderByPropName;
            var asc = requestModel.IsAscending;

            if (!string.IsNullOrEmpty(orderBy))
            {
                this.validationProvider.ValidateMustNotBeNull(orderBy, "OrderBy property name");
                this.validationProvider.ValidateMustNotBeNull(data, "data collection");
                this.validationProvider.ValidateMustNotBeNull(collectionDataType, "data collection generic type");

                var expr = OrderByLambda.LambdaExpression(collectionDataType, orderBy, asc);
                IQueryable<object> sorted = (IQueryable<object>)expr.Compile().DynamicInvoke(data);
                return sorted;
            }

            return data;
        }
    }
}
