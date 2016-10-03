namespace DataTables.ProcessDataProviders
{
    using System;
    using System.Linq;
    using Contracts;
    using DataTables.Expressions;
    using Models.Request;

    internal class GetIdentifiersProvider : IGetIdentifiersProvider
    {
        public GetIdentifiersProvider()
        {
        }

        public IQueryable Execute(IQueryable<object> data, RequestModel requestModel, Type dataGenericType)
        {
            if (requestModel.GetIdentifiers == false)
            {
                return null;
            }

            var propName = requestModel.IdentifierPropName;

            if (string.IsNullOrEmpty(propName))
            {
                throw new ArgumentNullException("Identifiers property name must be provided");
            }

            if (data == null)
            {
                throw new ArgumentNullException("Invalid null data");
            }

            IQueryable identifiers = SelectPropertyExpression.GetSelectCollection(dataGenericType,
                propName,
                data);

            return identifiers;
        }
    }
}
