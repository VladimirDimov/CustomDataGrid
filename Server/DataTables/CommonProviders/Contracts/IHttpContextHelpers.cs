namespace DataTables.CommonProviders.Contracts
{
    using System.Web.Mvc;

    interface IHttpContextHelpers
    {
        /// <summary>
        /// Returns the requested parameter as string or throws if the parameter is not found.
        /// </summary>
        /// <param name="param"></param>
        /// <param name="filterContext"></param>
        string GetRequestParameter(string param, ActionExecutedContext filterContext);
       
        /// <summary>
        /// Returns the requested parameter as string or null if the parameter is not found.
        /// </summary>
        /// <param name="param"></param>
        /// <param name="filterContext"></param>
        string GetRequestParameterOrDefault(string param, ActionExecutedContext filterContext);
    }
}