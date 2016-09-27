namespace DataTables.ProcessDataProviders
{
    using System;
    using System.Linq;
    using DataTables.Models.Request;

    /// <summary>
    /// Returns a collection of the data model identifiers. For example if the model identifiers is id the result will be a collection of the id type (int, string, etc.)
    /// </summary>
    internal interface IGetIdentifiersProvider
    {
        /// <summary>
        /// Get the data model identifiers
        /// </summary>
        /// <param name="data"></param>
        /// <param name="requestModel"></param>
        /// <param name="dataGenericType"></param>
        /// <returns></returns>
        IQueryable Execute(IQueryable<object> data, RequestModel requestModel, Type dataGenericType);
    }
}
