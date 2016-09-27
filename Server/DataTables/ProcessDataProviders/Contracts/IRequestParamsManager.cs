namespace DataTables.ProcessDataProviders.Contracts
{
    using System.Web.Mvc;
    using DataTables.Models.Request;

    public interface IRequestParamsManager
    {
        /// <summary>
        /// Returns a model with all passed values from the filter context
        /// </summary>
        /// <returns>RequestModel</returns>
        RequestModel GetRequestModel(ActionExecutedContext filterContext);
    }
}
