namespace DataTables.CommonProviders
{
    using DataTables.CommonProviders.Contracts;
    using System;
    using System.Web.Mvc;

    public class HttpContextHelpers : IHttpContextHelpers
    {
        public string GetRequestParameterOrDefault(string param, ActionExecutedContext filterContext)
        {
            if (param == null)
            {
                throw new ArgumentNullException("Invalid null argument value.");
            }

            var requestParam = filterContext.Controller.ValueProvider.GetValue(param);
            if (requestParam == null)
            {
                return null;
            }

            var requestedParamValue = requestParam.AttemptedValue;

            return requestedParamValue;
        }

        public string GetRequestParameter(string param, ActionExecutedContext filterContext)
        {
            if (param == null)
            {
                throw new ArgumentNullException("Invalid null argument value.");
            }

            var requestParam = filterContext.Controller.ValueProvider.GetValue(param);
            if (requestParam?.AttemptedValue == null)
            {
                throw new ArgumentException($"The request parameter \"{param}\" is missing.");
            }

            var requestedParamValue = requestParam.AttemptedValue;

            return requestedParamValue;
        }

    }
}
