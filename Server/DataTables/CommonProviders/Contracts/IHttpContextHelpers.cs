namespace DataTables.CommonProviders.Contracts
{
    using System.Web.Mvc;

    interface IHttpContextHelpers
    {
        string GetRequestParameter(string param, ActionExecutedContext filterContext);
        string GetRequestParameterOrDefault(string param, ActionExecutedContext filterContext);
    }
}