using DataTables.CommonProviders.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace DataTables.CommonProviders
{
    class HttpContextHelpers : IHttpContextHelpers
    {
        public string GetRequestParameterOrDefault(string param, ActionExecutedContext filterContext)
        {
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
            var requestParam = filterContext.Controller.ValueProvider.GetValue(param);
            if (requestParam == null)
            {
                throw new ArgumentException($"The request parameter \"{param}\" is missing.");
            }

            var requestedParamValue = requestParam.AttemptedValue;

            return requestedParamValue;
        }

    }
}
