namespace DataTables.ProcessDataProviders.Contracts
{
    using System;
    using System.Linq;
    using DataTables.Models.Request;

    /// <summary>
    /// Performs specific data processing.
    /// </summary>
    internal interface IProcessData
    {
        /// <summary>
        /// Process the data with the specific provider
        /// </summary>
        /// <param name="data"></param>
        /// <param name="requestModel"></param>
        /// <param name="dataCollectionGenericType"></param>
        /// <returns>Returns the processed data collection</returns>
        IQueryable<object> Execute(IQueryable<object> data, RequestModel requestModel, Type dataCollectionGenericType);
    }
}
