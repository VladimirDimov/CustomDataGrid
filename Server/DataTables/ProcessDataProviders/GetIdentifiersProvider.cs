namespace DataTables.ProcessDataProviders
{
    using DataTables.Expressions;
    using System;
    using System.Linq;

    class GetIdentifiersProvider
    {
        public GetIdentifiersProvider()
        {
        }

        public IQueryable GetIdentifierCollection(Type dataGenericType, string propName, IQueryable<object> data)
        {
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
